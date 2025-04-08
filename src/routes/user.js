import { Router } from "express";
import { asyncHandler } from "../utils/asyncWrapper.js";
const userRouter = Router();
import * as UserController from "../controllers/user.js"
userRouter.post("/add",asyncHandler(UserController.addUser))

export default userRouter;
