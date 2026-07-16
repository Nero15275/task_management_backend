import { Types } from "mongoose";
import { Task, TaskDocument, TaskModel } from "./task.model";

export async function create(taskData: Partial<Task>): Promise<TaskDocument> {
  return TaskModel.create(taskData);
}

export async function findById(id: string): Promise<TaskDocument | null> {
  return TaskModel.findById(id)
    .populate("assignedTo createdBy", "username email role reportsTo")
    .exec();
}

export async function findAll(): Promise<TaskDocument[]> {
  return TaskModel.find()
    .populate("assignedTo createdBy", "username email role reportsTo")
    .sort({ createdAt: -1 })
    .exec();
}

export async function findByAssignedUsers(userIds: string[]): Promise<TaskDocument[]> {
  const objectIds = userIds.map((id) => new Types.ObjectId(id));
  return TaskModel.find({ assignedTo: { $in: objectIds } })
    .populate("assignedTo createdBy", "username email role reportsTo")
    .sort({ createdAt: -1 })
    .exec();
}

export async function updateById(
  id: string,
  data: Partial<Task>
): Promise<TaskDocument | null> {
  return TaskModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("assignedTo createdBy", "username email role reportsTo")
    .exec();
}

export async function deleteById(id: string): Promise<boolean> {
  const result = await TaskModel.findByIdAndDelete(id).exec();
  return result !== null;
}