curl -s -X POST http://localhost:5000/customer/login -c cookie.txt -H "Content-Type: application/json" -d "{\"username\": \"testuser\", \"password\": \"testpassword\"}"

Customer successfully logged in
