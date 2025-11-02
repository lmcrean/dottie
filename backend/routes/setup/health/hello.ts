import express, { Request, Response } from 'express';

const router = express.Router();

router.get("/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello World from Dottie API!" });
});

export default router;
