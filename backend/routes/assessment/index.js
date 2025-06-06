import express from "express";

// Import route files
import createRouter from "./create/routes.js";
import listRouter from "./getList/routes.js";
import detailRouter from "./getDetail/routes.js";
// TODO: Update route implementation missing - uncomment when implemented
// import updateRouter from "./update/routes.js";
import deleteRouter from "./delete/routes.js";

const router = express.Router();

// Mount individual route handlers
router.use(createRouter);
router.use(listRouter);
router.use(detailRouter);
// router.use(updateRouter);
router.use(deleteRouter);

export default router;