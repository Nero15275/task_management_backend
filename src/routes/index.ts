import authRoutes from "@/modules/auth/auth.routes";
import { taskRoutes } from "@/modules/task/task.routes";
import userRoutes from "@/modules/user/user.routes";
import { Router } from "express";

const router = Router();


router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server is running"
  });
});

export default router;