import express from "express";

// Import route files
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Update route implementation missing - uncomment when implemented
// // TODO: Fix empty import
// TODO: Fix empty import

const router = express.Router();

// Mount individual route handlers
router.use(createRouter);
router.use(listRouter);
router.use(detailRouter);
// router.use(updateRouter);
router.use(deleteRouter);

export default router;
