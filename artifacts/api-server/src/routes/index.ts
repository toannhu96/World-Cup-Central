import { Router, type IRouter } from "express";
import healthRouter from "./health";
import footballRouter from "./football";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/football", footballRouter);

export default router;
