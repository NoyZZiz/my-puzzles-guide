import requests
import sys
import json
from datetime import datetime

class NoYzzingAPITester:
    def __init__(self, base_url="https://7214a102-bc4b-4a9d-9fd0-f282a74657bd.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failures = []

    def log(self, message):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        self.log(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            else:
                self.log(f"❌ Unsupported method: {method}")
                self.failures.append(f"{name}: Unsupported HTTP method")
                return False, {}

            self.log(f"   Status: {response.status_code}")
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    self.log(f"   Response: {json.dumps(response_data, indent=2)}")
                    return True, response_data
                except:
                    self.log(f"   Response (text): {response.text[:200]}...")
                    return True, {"text": response.text}
            else:
                self.log(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                self.log(f"   Response: {response.text[:200]}...")
                self.failures.append(f"{name}: Expected {expected_status}, got {response.status_code}")
                return False, {}

        except requests.exceptions.Timeout:
            self.log(f"❌ Failed - Request timeout")
            self.failures.append(f"{name}: Request timeout")
            return False, {}
        except requests.exceptions.ConnectionError as e:
            self.log(f"❌ Failed - Connection error: {str(e)}")
            self.failures.append(f"{name}: Connection error")
            return False, {}
        except Exception as e:
            self.log(f"❌ Failed - Error: {str(e)}")
            self.failures.append(f"{name}: {str(e)}")
            return False, {}

    def test_health_endpoint(self):
        """Test the health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        
        if success:
            # Verify response structure
            required_fields = ["status", "timestamp", "version"]
            for field in required_fields:
                if field not in response:
                    self.log(f"⚠️ Warning: Missing field '{field}' in health response")
                    return False
            
            if response.get("status") != "operational":
                self.log(f"⚠️ Warning: System status is not 'operational': {response.get('status')}")
                return False
                
            self.log(f"✅ Health check passed: System is {response.get('status')}")
            return True
        return False

    def test_newsletter_subscription(self):
        """Test newsletter subscription endpoint"""
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@noyzzing.test"
        
        # Test valid subscription
        success, response = self.run_test(
            "Newsletter Subscription (Valid)",
            "POST",
            "api/newsletter/subscribe",
            200,
            data={"email": test_email}
        )
        
        if not success:
            return False

        # Test duplicate subscription
        success2, response2 = self.run_test(
            "Newsletter Subscription (Duplicate)",
            "POST", 
            "api/newsletter/subscribe",
            200,
            data={"email": test_email}
        )
        
        if success2 and response2.get("message") == "Already subscribed":
            self.log("✅ Duplicate email handling works correctly")
        
        # Test invalid email format
        success3, response3 = self.run_test(
            "Newsletter Subscription (Invalid Email)",
            "POST",
            "api/newsletter/subscribe", 
            400,
            data={"email": "invalid-email"}
        )
        
        if success3:
            self.log("✅ Invalid email validation works correctly")
            
        return success and success2 and success3

    def test_contact_form(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@noyzzing.test",
            "message": "This is a test contact message from the API test suite."
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "api/contact",
            200,
            data=test_data
        )
        
        if success:
            if "message" in response and "received" in response["message"].lower():
                self.log("✅ Contact form submission successful")
                return True
            else:
                self.log(f"⚠️ Warning: Unexpected response format: {response}")
                
        return success

    def test_stats_endpoint(self):
        """Test the stats endpoint"""
        success, response = self.run_test(
            "Statistics Endpoint",
            "GET", 
            "api/stats",
            200
        )
        
        if success:
            expected_fields = ["subscribers", "contacts", "guides", "tools", "pages"]
            for field in expected_fields:
                if field not in response:
                    self.log(f"⚠️ Warning: Missing field '{field}' in stats response")
                    return False
                    
            self.log(f"📊 Stats: {response}")
            return True
            
        return False

    def test_api_cors(self):
        """Test CORS headers are properly set"""
        try:
            response = requests.options(f"{self.base_url}/api/health", timeout=10)
            cors_headers = [
                "access-control-allow-origin",
                "access-control-allow-methods", 
                "access-control-allow-headers"
            ]
            
            has_cors = any(header in response.headers for header in cors_headers)
            
            if has_cors:
                self.log("✅ CORS headers detected")
                return True
            else:
                self.log("⚠️ Warning: CORS headers may not be properly configured")
                return False
                
        except Exception as e:
            self.log(f"⚠️ CORS test failed: {str(e)}")
            return False

def main():
    """Run all API tests"""
    print("="*60)
    print("🚀 NoYzzing OPS Backend API Test Suite")
    print("="*60)
    
    tester = NoYzzingAPITester()
    
    # Run all tests
    tests = [
        ("Health Check", tester.test_health_endpoint),
        ("Newsletter Subscription", tester.test_newsletter_subscription),
        ("Contact Form", tester.test_contact_form), 
        ("Statistics", tester.test_stats_endpoint),
        ("CORS Configuration", tester.test_api_cors),
    ]
    
    test_results = []
    
    for test_name, test_func in tests:
        print(f"\n📋 Running {test_name} tests...")
        try:
            result = test_func()
            test_results.append((test_name, result))
            if result:
                print(f"✅ {test_name}: PASSED")
            else:
                print(f"❌ {test_name}: FAILED") 
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {str(e)}")
            test_results.append((test_name, False))
            tester.failures.append(f"{test_name}: {str(e)}")
    
    # Print summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    passed_tests = sum(1 for _, result in test_results if result)
    total_tests = len(test_results)
    
    print(f"Total API calls: {tester.tests_run}")
    print(f"Successful calls: {tester.tests_passed}")
    print(f"Test suites passed: {passed_tests}/{total_tests}")
    print(f"Success rate: {(passed_tests/total_tests)*100:.1f}%")
    
    if tester.failures:
        print(f"\n❌ FAILURES ({len(tester.failures)}):")
        for i, failure in enumerate(tester.failures, 1):
            print(f"  {i}. {failure}")
    
    if passed_tests == total_tests:
        print("\n🎉 ALL TESTS PASSED! Backend API is functioning correctly.")
        return 0
    else:
        print(f"\n⚠️ {total_tests - passed_tests} test suite(s) failed. Check the failures above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())