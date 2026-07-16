import { Router } from "express";
import * as taskController from "./task.controller";
import { authenticate, validate } from "@/common"; // Your authentication middleware
import { createTaskSchema } from "./dto/createTask.dto";
import { updateTaskSchema } from "./dto/updateTask.dto";

const router = Router();

// Protect all task endpoints 
router.use(authenticate);

router.post("/", validate(createTaskSchema),taskController.create);
router.get("/", taskController.getAll);
router.patch("/:id", validate(updateTaskSchema), taskController.update);
router.delete("/:id", taskController.deleteOne);

export const taskRoutes = router;