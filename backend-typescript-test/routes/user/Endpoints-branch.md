# User Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/` | GET | Get list of all users |
| `/api/user/me` | GET | Get current user |
| `/api/user/:id` | GET | Get user by ID (todo: replace with /api/user/me) |
| `/api/user/:id` | PUT | Update a user |
| `/api/user/:id` | DELETE | Delete a user |
| `/api/user/pw/reset` | POST | Reset forgotten password |
| `/api/user/pw/update` | POST | Update current user's password |

## Request Examples

```javascript
// Update password
fetch("/api/user/pw/update", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-access-token"
  },
  body: JSON.stringify({
    currentPassword: "oldPassword123",
    newPassword: "newSecurePassword456"
  })
});
``` 