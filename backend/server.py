from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

security = HTTPBearer()

# Create the main app
app = FastAPI()

# Create API router
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str = "operator"  # operator, supervisor, manager

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

class Token(BaseModel):
    token: str
    user: User

class BatchBase(BaseModel):
    batch_name: str
    raw_material_qty: float
    production_stage: str  # Melting, Casting, Finishing
    output_qty: float

class BatchCreate(BatchBase):
    pass

class Batch(BatchBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "In Progress"  # In Progress, Completed, Pending
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EmployeeBase(BaseModel):
    name: str
    role: str  # Operator, Supervisor
    shift: str = "Morning"  # Morning, Evening, Night

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ShiftAllocationBase(BaseModel):
    employee_id: str
    employee_name: str
    shift: str  # Morning, Evening, Night
    date: str

class ShiftAllocationCreate(ShiftAllocationBase):
    pass

class ShiftAllocation(ShiftAllocationBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AttendanceBase(BaseModel):
    employee_id: str
    employee_name: str
    role: str
    status: str  # Present, Absent
    date: str

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DashboardStats(BaseModel):
    active_batches: int
    total_raw_material: float
    total_output: float
    efficiency: float

# ============ HELPER FUNCTIONS ============

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        user = await db.users.find_one({"email": email}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication")

# ============ AUTH ROUTES ============

@api_router.post("/auth/register", response_model=Token)
async def register(user_input: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_input.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = user_input.model_dump()
    user_dict["password"] = get_password_hash(user_dict["password"])
    user_obj = User(**{k: v for k, v in user_dict.items() if k != "password"})
    
    doc = user_obj.model_dump()
    doc["password"] = user_dict["password"]
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.users.insert_one(doc)
    
    # Create token
    access_token = create_access_token(data={"sub": user_obj.email})
    
    return Token(token=access_token, user=user_obj)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_obj = User(**{k: v for k, v in user.items() if k != "password" and k != "_id"})
    access_token = create_access_token(data={"sub": user_obj.email})
    
    return Token(token=access_token, user=user_obj)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ============ BATCH ROUTES ============

@api_router.post("/batches", response_model=Batch)
async def create_batch(batch: BatchCreate, current_user: User = Depends(get_current_user)):
    batch_obj = Batch(**batch.model_dump())
    doc = batch_obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.batches.insert_one(doc)
    return batch_obj

@api_router.get("/batches", response_model=List[Batch])
async def get_batches(current_user: User = Depends(get_current_user)):
    batches = await db.batches.find({}, {"_id": 0}).to_list(1000)
    for batch in batches:
        if isinstance(batch["created_at"], str):
            batch["created_at"] = datetime.fromisoformat(batch["created_at"])
    return batches

@api_router.get("/batches/{batch_id}", response_model=Batch)
async def get_batch(batch_id: str, current_user: User = Depends(get_current_user)):
    batch = await db.batches.find_one({"id": batch_id}, {"_id": 0})
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    if isinstance(batch["created_at"], str):
        batch["created_at"] = datetime.fromisoformat(batch["created_at"])
    return Batch(**batch)

@api_router.put("/batches/{batch_id}", response_model=Batch)
async def update_batch(batch_id: str, batch_update: BatchCreate, current_user: User = Depends(get_current_user)):
    existing_batch = await db.batches.find_one({"id": batch_id})
    if not existing_batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    update_data = batch_update.model_dump()
    await db.batches.update_one({"id": batch_id}, {"$set": update_data})
    
    updated_batch = await db.batches.find_one({"id": batch_id}, {"_id": 0})
    if isinstance(updated_batch["created_at"], str):
        updated_batch["created_at"] = datetime.fromisoformat(updated_batch["created_at"])
    return Batch(**updated_batch)

@api_router.delete("/batches/{batch_id}")
async def delete_batch(batch_id: str, current_user: User = Depends(get_current_user)):
    result = await db.batches.delete_one({"id": batch_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Batch not found")
    return {"message": "Batch deleted successfully"}

# ============ EMPLOYEE ROUTES ============

@api_router.post("/employees", response_model=Employee)
async def create_employee(employee: EmployeeCreate, current_user: User = Depends(get_current_user)):
    employee_obj = Employee(**employee.model_dump())
    doc = employee_obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.employees.insert_one(doc)
    return employee_obj

@api_router.get("/employees", response_model=List[Employee])
async def get_employees(current_user: User = Depends(get_current_user)):
    employees = await db.employees.find({}, {"_id": 0}).to_list(1000)
    for emp in employees:
        if isinstance(emp["created_at"], str):
            emp["created_at"] = datetime.fromisoformat(emp["created_at"])
    return employees

@api_router.delete("/employees/{employee_id}")
async def delete_employee(employee_id: str, current_user: User = Depends(get_current_user)):
    result = await db.employees.delete_one({"id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}

# ============ SHIFT ALLOCATION ROUTES ============

@api_router.post("/shifts", response_model=ShiftAllocation)
async def create_shift(shift: ShiftAllocationCreate, current_user: User = Depends(get_current_user)):
    shift_obj = ShiftAllocation(**shift.model_dump())
    doc = shift_obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.shifts.insert_one(doc)
    return shift_obj

@api_router.get("/shifts", response_model=List[ShiftAllocation])
async def get_shifts(current_user: User = Depends(get_current_user)):
    shifts = await db.shifts.find({}, {"_id": 0}).to_list(1000)
    for shift in shifts:
        if isinstance(shift["created_at"], str):
            shift["created_at"] = datetime.fromisoformat(shift["created_at"])
    return shifts

# ============ ATTENDANCE ROUTES ============

@api_router.post("/attendance", response_model=Attendance)
async def create_attendance(attendance: AttendanceCreate, current_user: User = Depends(get_current_user)):
    attendance_obj = Attendance(**attendance.model_dump())
    doc = attendance_obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.attendance.insert_one(doc)
    return attendance_obj

@api_router.get("/attendance", response_model=List[Attendance])
async def get_attendance(current_user: User = Depends(get_current_user)):
    attendance_records = await db.attendance.find({}, {"_id": 0}).to_list(1000)
    for record in attendance_records:
        if isinstance(record["created_at"], str):
            record["created_at"] = datetime.fromisoformat(record["created_at"])
    return attendance_records

# ============ DASHBOARD ROUTES ============

@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    batches = await db.batches.find({}, {"_id": 0}).to_list(1000)
    
    active_batches = len([b for b in batches if b.get("status") == "In Progress"])
    total_raw_material = sum(b.get("raw_material_qty", 0) for b in batches)
    total_output = sum(b.get("output_qty", 0) for b in batches)
    efficiency = round((total_output / total_raw_material * 100) if total_raw_material > 0 else 0, 2)
    
    return DashboardStats(
        active_batches=active_batches,
        total_raw_material=total_raw_material,
        total_output=total_output,
        efficiency=efficiency
    )

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
