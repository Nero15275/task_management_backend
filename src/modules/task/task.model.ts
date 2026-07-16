import { HydratedDocument, InferSchemaType, Model, Schema, model } from "mongoose";
import { TaskStatus } from "@/common/enums/task-status.enum";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: Object.values(TaskStatus),
      required: true,
      default: TaskStatus.PENDING,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export type Task = InferSchemaType<typeof taskSchema>;
export type TaskDocument = HydratedDocument<Task>;
export type TaskModel = Model<Task>;

export const TaskModel = model<Task>("Task", taskSchema);