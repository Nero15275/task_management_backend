import { Types } from "mongoose";
import { z } from "zod";
import { TaskStatus } from "@/common/enums/task-status.enum";

export const updateTaskSchema = z.object({
  title: z.string().trim().min(3).max(100).optional(),
  
  description: z.string().trim().max(1000).optional(),
  
  status: z.nativeEnum(TaskStatus).optional(),
  
  assignedTo: z
    .string()
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "Invalid assigned user ID",
    })
    .optional(),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;