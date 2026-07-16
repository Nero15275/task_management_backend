import { Types } from "mongoose";
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(3).max(100),
  
  description: z.string().trim().max(1000).optional(),
  
  assignedTo: z
    .string()
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "Invalid assigned user ID",
    })
    .optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;