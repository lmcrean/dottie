import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// 404 handler
router.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Server error" });
});

export default router;
