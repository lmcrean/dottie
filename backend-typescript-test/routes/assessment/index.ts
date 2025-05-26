import express from "express";

// Import route files
import createRouter from '';
import listRouter from '';
import detailRouter from '';
// TODO: Update route implementation missing - uncomment when implemented
// import updateRouter from '';
import deleteRouter from '';

const router = express.Router();

// Mount individual route handlers
router.use(createRouter);
router.use(listRouter);
router.use(detailRouter);
// router.use(updateRouter);
router.use(deleteRouter);

export default router;
