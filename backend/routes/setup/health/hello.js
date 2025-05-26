import express from 'express';

const router = express.Router();

router.get("/hello", (req, res) => {
  res.json({ message: "Hello World from Dottie API!" });
});

export default router; 