import { Router } from "express";

import * as UserController from "@/modules/user/user.controller";
import { UserRole, validate, authenticate, authorize } from "@/common";
import { createUserSchema } from "./dto/createUser.dto";
import { updateUserSchema } from "./dto/updateUser.dto";

const router = Router();

router.post("/", validate(createUserSchema), UserController.createUser);

router.get(
  "/",
  authenticate,
  authorize(UserRole.MANAGER),
  UserController.getAllUsers,
);

router.get(
  "/reporting",
  authenticate,
  authorize(UserRole.MANAGER, UserRole.TEAM_LEAD),
  UserController.getReportingUsers,
);

router.get("/:id", UserController.getUserById);

router.put(
  "/:id",
  authenticate,
  validate(updateUserSchema),
  UserController.updateUser,
);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MANAGER, UserRole.TEAM_LEAD),
  UserController.deleteUser,
);



export default router;
