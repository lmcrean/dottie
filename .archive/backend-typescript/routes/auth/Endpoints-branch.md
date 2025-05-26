# Authentication Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register a new user account |
| `/api/auth/login` | POST | Authenticate user and get access token |
| `/api/auth/logout` | POST | Logout user and invalidate token |

## Request Examples

```javascript
// Signup
fetch("/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "user123",
    email: "user@example.com",
    password: "securePassword123"
  })
});

// Login
fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "securePassword123"
  })
});
``` 