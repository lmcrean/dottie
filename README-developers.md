# Readme for developers

# Usage

this is a node.js project with a split backend and frontend.

## concurrent workflow

due to a concurrent workflow, the developer runs both the backend and frontend at the same time.

```
cd frontend; npm run dev
```

## Prerequisites

to setup the project, run the following commands in 2 terminals:

```bash
cd backend; npm install
```

```bash
cd frontend; npm install; npm run build; npm run dev
```

# Understanding the Dependency chain
when integrating an API feature successfully, consider the dependency chain between 

1. `backend/routes/[app]/[endpoint]/` 
2. `frontend/src/api/[app]/requests/[endpoint]/Request.ts` 
3. `frontend/src/test_page/test-endpoint-table/[app]/[endpoint]/EndpointRow.tsx`


For example for a `get user` endpoint the dependency chain from the backend to the frontend is:
For example for a `get user` endpoint the dependency chain from the backend to the frontend is:
1. `backend/routes/user/get-user/route.js`
2. `backend/routes/user/get-user/controller.js`
3. `frontend/src/api/user/requests/getCurrentUser/Request.ts`
4. `frontend/src/test_page/test-endpoint-table/user/get-user-me/EndpointRow.tsx`

Any backend requests should appear as a success message in the `Developer Mode` UI (bottom right button)
