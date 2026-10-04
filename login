# Task 8: Login as a registered user

cURL Command:
curl -X POST http://localhost:5000/customer/login -c cookie.txt -H "Content-Type: application/json" -d '{"username": "testuser", "password": "testpassword"}'

Output:
{
    "message": "Customer successfully logged in",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
