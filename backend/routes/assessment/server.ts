import express from "express";
// TODO: Fix empty import

const assessmentRouter = express.Router();

// Mount the assessment router at /api/assessment
assessmentRouter.use("/api/assessment", router);

export default assessmentRouter; 
