import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

router.get("/j", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.send("General Kenobi");
  } else {
    res.send("auth failed");
  }
});

export const ModelGeneratorController: Router = router;
