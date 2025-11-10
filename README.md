# Gbese

```
   ___________.                         
 /  _____/\_ |__   ____   ______ ____  
/   \  ___ | __ \_/ __ \ /  ___// __ \ 
\    \_\  \| \_\ \  ___/ \___ \\  ___/ 
 \______  /|___  /\___  >____  >\___  >
        \/     \/     \/     \/     \/ 

Backend API for credit tracker application
```

## API Documentation (from Postman collection)

Base URL (examples)
- Local: http://localhost:3000
- Hosted example: https://gbese-6f0j.onrender.com

Authentication
- Access tokens returned on successful login. Send as:
  Authorization: Bearer <accessToken>
- Refresh token is issued as an HttpOnly cookie named refreshToken and used by the /api/refresh-token endpoint.
- Protected endpoints require the Authorization header (and the refresh cookie where applicable).

Common response shapes
- Success:
``` json
  {
    "success": true,
    ...data...
  }
  ```
- Error:
``` json
  {
    "success": false,
    "error": "Human readable message"
  }
  ```
- Validation errors:
``` json
  {
    "success": false,
    "message": "Validation errors",
    "data": [ "field msg", ... ]
  }
  ```

## Endpoints

### 1) Register
- POST `/api/register`
- Body (application/json):
```json
  {
    "username": "Test",
    "email": "test@mail.com",
    "password": "passwoRd@123",
    "confirmPassword": "passwoRd@123"
  }
  ```
- Success: 
`201`
```json 
{ "success": true, "message": "User registered" }
```
- Validation failure: 400 — returns validation messages

Example:
```
curl -X POST https://gbese-6f0j.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"Test","email":"test@mail.com","password":"passwoRd@123","confirmPassword":"passwoRd@123"}'
```

### 2) Login
- POST `/api/login`
- Body: 
```json
{ "email": "test@mail.com", "password": "passwoRd@123" }
```
- Success: `200`
```json
  {
    "success": true,
    "user": { "id": 1, "email": "...", "username": "..." },
    "accessToken": "<jwt>"
  }
```
- Invalid credentials: `401`
- **Server may set an HttpOnly refreshToken cookie on successful login.**

Example:
```
curl -X POST https://gbese-6f0j.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.com","password":"passwoRd@123"}' \
  -i
```

### 3) Refresh token
- POST `/api/refresh-token`
- Expects refreshToken cookie.
- Success: `200` 
```json
{ "success": true, "accessToken": "<new access token>" }
```
- Errors:
  - `401`: No refresh token
  - `403`: Refresh token revoked or not found

### 4) Logout
- POST /api/logout
- Clears refresh token cookie.
- Success: `200` 
```json
{ "success": true }
```

### 5) Add Record
- POST `/api/add-record`
- Protected: requires Authorization: Bearer <token>
- Body:
```json
  {
    "customerName": "John Doe",
    "customerPhoneNumber": "08123456789", // optional
    "email": "Example@test.com",          // optional
    "amount": "17000",
    "payment": "9000.00",                 // optional
    "transactionType": "lend",
    "dueDate": "2025-11-12",
    "description": "Power bank 17k, paid 9k"
  }
```
- Success: `201` 
```json
{ "success": true, "message": "Added new record" }
```
- Unbalanced / duplicate un-cleared record: `400` 
```json
{ "success": false, "error": "There is an unbalanced record with this name" }
```

### 6) Admin Statistics
- GET `/api/admin/stats?start=YYYY-MM-DD&end=YYYY-MM-DD`
- Protected (admin-only)
- Query params:
  - start (required) — ISO date
  - end (required) — ISO date
- Success: `200` 
```json
{ "success": true, "statistics": { ... } }
```
- Forbidden (non-admin): `403`

### 7) Search
- GET `/api/search`
- Protected
- Query: **search either by id OR name *(not both)*.**
  - `/api/search?id=11`
  - `/api/search?name=alice`
- Success: `200` 
```json
{ "success": true, "record": [ { record... }, ... ] }
```
- Errors:
  - `400`: "Search either by id or name"
  - `404`: "Record not found"

### 8) User Dashboard Statistics
- GET `/api/dashboard/stats`
- Protected
- Success: `200` 
```json
{ "success": true, "statistics": { ... } }
```

### 9) Get Records
- GET `/api/get-records`
- Protected: requires Authorization: Bearer <token>
- Query params (all optional):
  - start — ISO date (e.g., 2025-11-01)
  - end — ISO date (e.g., 2025-11-30)
  - type — transaction type filter (e.g., lend, borrow)
- Behavior:
  - When start/end provided the endpoint returns records within the date range.
  - When no params provided it returns all records.
- Success: `200`
```json
{
  "success": true,
  "record": [
    {
      "id": 1,
      "customerName": "mommy grace",
      "customerPhoneNumber": "08123556789",
      "email": "Example@test.com",
      "amount": 16000,
      "payment": null,
      "balance": 16000,
      "beenCleared": 0,
      "transactionType": "lend",
      "dueDate": "2025-11-12T00:00:00.000Z",
      "description": "3ctns of Caprison",
      "createdAt": "2025-11-08T18:29:16.000Z",
      "updatedAt": "2025-11-08T18:29:16.000Z"
    }
  ]
}
```
- Example (with filters):
```
curl -X GET "https://gbese-6f0j.onrender.com/api/get-records?start=2025-11-08&end=2025-11-30&type=lend" \
  -H "Authorization: Bearer <token>"
```


## Notes
- Use the accessToken in Authorization header for protected endpoints.
- Refresh token flows rely on an HttpOnly cookie; client should preserve cookies between requests.
- Dates are ISO8601 (e.g., 2025-11-06). Amounts in examples may be strings; server accepts numeric-like values.
- For admin-only endpoints ensure the user has admin privileges (token payload / user record).

