import { Router } from "express";

import * as UserController from "@/modules/user/user.controller";
import { UserRole, validate,authenticate,authorize} from "@/common";
import { createUserSchema } from "./dto/createUser.dto";
import { updateUserSchema } from "./dto/updateUser.dto";


const router = Router();

router.post("/",validate(createUserSchema), UserController.createUser);

router.get("/",authenticate,authorize(UserRole.MANAGER), UserController.getAllUsers);

router.get("/:id", UserController.getUserById);

router.put("/:id", validate(updateUserSchema),UserController.updateUser);

router.delete("/:id", UserController.deleteUser);

export default router;