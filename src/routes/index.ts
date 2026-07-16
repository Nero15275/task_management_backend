import authRoutes from "@/modules/auth/auth.routes";
import userRoutes from "@/modules/user/user.routes";
import { Router } from "express";

const router = Router();


router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server is running"
  });
});

export default router;