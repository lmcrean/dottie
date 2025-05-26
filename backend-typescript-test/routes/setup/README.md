# Setup Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/setup/health/hello` | GET | Test endpoint that returns "Hello World from Dottie API!" |
| `/api/setup/database/hello` | GET | Test endpoint that returns a hello message from the database (SQLite or Azure SQL) |
| `/api/setup/database/status` | GET | Check database connection status |

## Request Examples

```javascript
// Test API health
fetch("/api/setup/health/hello")
  .then(response => response.json())
  .then(data => console.log(data));
// Response: { "message": "Hello World from Dottie API!" }

// Test database connection with hello
fetch("/api/setup/database/hello")
  .then(response => response.json())
  .then(data => console.log(data));
// Response: { "message": "Hello World from SQLite!", "dbType": "sqlite3", "isConnected": true }

// Check database status
fetch("/api/setup/database/status")
  .then(response => response.json())
  .then(data => console.log(data));
// Response: { "status": "connected" }
``` 