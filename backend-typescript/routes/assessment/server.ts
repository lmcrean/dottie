import express from "express";
import router from '';

const assessmentRouter = express.Router();

// Mount the assessment router at /api/assessment
assessmentRouter.use("/api/assessment", router);

export default assessmentRouter; 
