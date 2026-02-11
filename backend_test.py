import requests
import sys
from datetime import datetime
import json

class SteelCRMTester:
    def __init__(self, base_url="https://steel-shell-crm.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.user_id = None
        self.employee_id = None
        self.batch_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json() if response.text else {}
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_auth_flow(self):
        """Test authentication flow"""
        print("\n🔐 Testing Authentication Flow...")
        
        # Test login with demo credentials
        success, response = self.run_test(
            "Login with demo credentials",
            "POST",
            "auth/login",
            200,
            data={"email": "manager@unique.com", "password": "password123"}
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response.get('user', {}).get('id')
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        else:
            print("❌ Login failed - cannot proceed with authenticated tests")
            return False

    def test_dashboard_stats(self):
        """Test dashboard statistics"""
        print("\n📊 Testing Dashboard Stats...")
        
        success, response = self.run_test(
            "Get dashboard stats",
            "GET",
            "dashboard/stats",
            200
        )
        
        if success:
            required_fields = ['active_batches', 'total_raw_material', 'total_output', 'efficiency']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field in stats: {field}")
                    return False
            print(f"   Stats: {response}")
        
        return success

    def test_batch_operations(self):
        """Test batch CRUD operations"""
        print("\n📦 Testing Batch Operations...")
        
        # Create batch
        batch_data = {
            "batch_name": f"Test Batch {datetime.now().strftime('%H%M%S')}",
            "raw_material_qty": 1000.0,
            "production_stage": "Melting",
            "output_qty": 850.0
        }
        
        success, response = self.run_test(
            "Create batch",
            "POST",
            "batches",
            200,
            data=batch_data
        )
        
        if success and 'id' in response:
            self.batch_id = response['id']
            print(f"   Created batch ID: {self.batch_id}")
        else:
            return False
        
        # Get all batches
        success, response = self.run_test(
            "Get all batches",
            "GET",
            "batches",
            200
        )
        
        if not success:
            return False
        
        # Get specific batch
        success, response = self.run_test(
            "Get specific batch",
            "GET",
            f"batches/{self.batch_id}",
            200
        )
        
        if not success:
            return False
        
        # Update batch
        update_data = {
            "batch_name": "Updated Test Batch",
            "raw_material_qty": 1200.0,
            "production_stage": "Casting",
            "output_qty": 1000.0
        }
        
        success, response = self.run_test(
            "Update batch",
            "PUT",
            f"batches/{self.batch_id}",
            200,
            data=update_data
        )
        
        if not success:
            return False
        
        # Delete batch
        success, response = self.run_test(
            "Delete batch",
            "DELETE",
            f"batches/{self.batch_id}",
            200
        )
        
        return success

    def test_employee_operations(self):
        """Test employee CRUD operations"""
        print("\n👥 Testing Employee Operations...")
        
        # Create employee
        employee_data = {
            "name": f"Test Employee {datetime.now().strftime('%H%M%S')}",
            "role": "Operator",
            "shift": "Morning"
        }
        
        success, response = self.run_test(
            "Create employee",
            "POST",
            "employees",
            200,
            data=employee_data
        )
        
        if success and 'id' in response:
            self.employee_id = response['id']
            print(f"   Created employee ID: {self.employee_id}")
        else:
            return False
        
        # Get all employees
        success, response = self.run_test(
            "Get all employees",
            "GET",
            "employees",
            200
        )
        
        if not success:
            return False
        
        # Delete employee
        success, response = self.run_test(
            "Delete employee",
            "DELETE",
            f"employees/{self.employee_id}",
            200
        )
        
        return success

    def test_shift_operations(self):
        """Test shift allocation operations"""
        print("\n⏰ Testing Shift Operations...")
        
        # First create an employee for shift allocation
        employee_data = {
            "name": "Shift Test Employee",
            "role": "Supervisor",
            "shift": "Evening"
        }
        
        success, response = self.run_test(
            "Create employee for shift test",
            "POST",
            "employees",
            200,
            data=employee_data
        )
        
        if not success or 'id' not in response:
            return False
        
        temp_employee_id = response['id']
        
        # Create shift allocation
        shift_data = {
            "employee_id": temp_employee_id,
            "employee_name": "Shift Test Employee",
            "shift": "Evening",
            "date": datetime.now().strftime('%Y-%m-%d')
        }
        
        success, response = self.run_test(
            "Create shift allocation",
            "POST",
            "shifts",
            200,
            data=shift_data
        )
        
        if not success:
            return False
        
        # Get all shifts
        success, response = self.run_test(
            "Get all shifts",
            "GET",
            "shifts",
            200
        )
        
        # Clean up - delete the test employee
        self.run_test(
            "Delete test employee",
            "DELETE",
            f"employees/{temp_employee_id}",
            200
        )
        
        return success

    def test_attendance_operations(self):
        """Test attendance operations"""
        print("\n✅ Testing Attendance Operations...")
        
        # First create an employee for attendance
        employee_data = {
            "name": "Attendance Test Employee",
            "role": "Operator",
            "shift": "Night"
        }
        
        success, response = self.run_test(
            "Create employee for attendance test",
            "POST",
            "employees",
            200,
            data=employee_data
        )
        
        if not success or 'id' not in response:
            return False
        
        temp_employee_id = response['id']
        
        # Create attendance record
        attendance_data = {
            "employee_id": temp_employee_id,
            "employee_name": "Attendance Test Employee",
            "role": "Operator",
            "status": "Present",
            "date": datetime.now().strftime('%Y-%m-%d')
        }
        
        success, response = self.run_test(
            "Create attendance record",
            "POST",
            "attendance",
            200,
            data=attendance_data
        )
        
        if not success:
            return False
        
        # Get all attendance records
        success, response = self.run_test(
            "Get all attendance records",
            "GET",
            "attendance",
            200
        )
        
        # Clean up - delete the test employee
        self.run_test(
            "Delete test employee",
            "DELETE",
            f"employees/{temp_employee_id}",
            200
        )
        
        return success

    def test_protected_routes(self):
        """Test protected routes without authentication"""
        print("\n🔒 Testing Protected Routes...")
        
        # Save current token
        original_token = self.token
        self.token = None
        
        # Test accessing protected route without token
        success, response = self.run_test(
            "Access batches without auth (should fail)",
            "GET",
            "batches",
            401
        )
        
        # Restore token
        self.token = original_token
        
        return success

def main():
    print("🏭 Starting Steel Manufacturing CRM API Tests")
    print("=" * 60)
    
    tester = SteelCRMTester()
    
    # Run all tests
    auth_success = tester.test_auth_flow()
    if not auth_success:
        print("\n❌ Authentication failed - stopping tests")
        return 1
    
    # Test all modules
    tests = [
        tester.test_dashboard_stats,
        tester.test_batch_operations,
        tester.test_employee_operations,
        tester.test_shift_operations,
        tester.test_attendance_operations,
        tester.test_protected_routes
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure.get('name', 'Unknown')}: {failure}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if success_rate >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())