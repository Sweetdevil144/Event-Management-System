# Postman API Responses Documentation

This document includes the response details for the **Login** and **Registration** API endpoints.

---

## 1. **Login API**

### Endpoint

`POST {{hosted}}/api/auth/login`

### Request Body

```json
{
  "email": "test@example.com",
  "password": "your-password"
}
```

### Response

**Status Code**: 200 OK

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Nzg3ODI1M2E4Njg2YTc1ZmQ5ZjRlOTkiLCJyb2xlIjoidXNlciIsImlhdCI6MTczNjkzNDQyNywiZXhwIjoxNzM2OTM4MDI3fQ.2zn5ThRtti58JLUynz54VrYGsnhF4K96YXMevTirFec",
  "user": {
    "id": "67878253a8686a75fd9f4e99",
    "name": "Charlie Tester",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### Response Breakdown

- **message**: A message indicating the result of the login attempt.
- **token**: JWT token used for authenticated requests.
- **user**:
  - **id**: Unique identifier of the user.
  - **name**: Full name of the logged-in user.
  - **email**: Email address of the user.
  - **role**: User's role within the system (e.g., user, admin).

---

## 2. **Registration API**

### Endpoint

`POST {{hosted}}/api/auth/register`

### Request Body

```json
{
  "name": "Charlie Tester",
  "email": "test@example.com",
  "password": "your-password"
}
```

### Response

**Status Code**: 201 Created

```json
{
  "id": "67878253a8686a75fd9f4e99",
  "name": "Charlie Tester",
  "email": "test@example.com"
}
```

### Response Breakdown

- **id**: Unique identifier of the registered user.
- **name**: Full name of the newly registered user.
- **email**: Email address of the newly registered user.

---

### Notes

- For **login**, the **token** returned can be used for authenticating subsequent requests.
- For **registration**, make sure the user does not already exist with the same email to avoid conflicts.
- The **role** attribute in the **login response** is a key indicator of the user's privileges within the system.
