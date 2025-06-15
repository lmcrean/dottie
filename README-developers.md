# README for Developers

This is a **Node.js monorepo** project with separate **frontend** and **backend** applications.

---

## 🔧 Prerequisites

You have two options for running the project in development mode:

---

## ⚙️ Option 1 (Recommended): Run Backend and Frontend in Separate Terminals

Start each service in its own terminal window.

### 1. Start Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev:frontend
```

---

## ⚡ Option 2: Run Backend and Frontend Concurrently in One Terminal

A concurrent workflow is available to run both services simultaneously using a single command.

```bash
cd frontend
npm install
npm run dev
```

---

## 🔍 Understanding the Dependency Chain (API Integration Guide)

When integrating new API features, ensure consistency across the **backend route**, **API request layer**, and **frontend UI test interface**.

### Example: `GET /user`

**Backend**

1. Route: `backend/routes/user/get-user/route.js`
2. Controller: `backend/routes/user/get-user/controller.js`

**Frontend**

3. API Request: `frontend/src/api/user/requests/getCurrentUser/Request.ts`
4. UI Test-Page: `frontend/src/test_page/test-endpoint-table/user/get-user-me/EndpointRow.tsx`

> ✅ All successful backend requests will be reflected in the `Developer Mode` UI, accessible via the bottom-right button.

---

## Node Version

This project uses Node.js v23.11.0  
Run `nvm install` after cloning or switching branches to ensure compatibility.
