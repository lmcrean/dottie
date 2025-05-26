import express from "express";

// Import route files
import createRouter from './create/routes.ts';
import listRouter from './getList/routes.ts';
import detailRouter from './getDetail/routes.ts';
// TODO: Update route implementation missing - uncomment when implemented
// import updateRouter from './update/routes.ts';
import deleteRouter from './delete/routes.ts';

const router = express.Router();

// Mount individual route handlers
router.use(createRouter);
router.use(listRouter);
router.use(detailRouter);
// router.use(updateRouter);
router.use(deleteRouter);

export default router;
