import express from 'express';

const router = express.Router();

// 404 handler
router.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
router.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Server error" });
});

export default router; 