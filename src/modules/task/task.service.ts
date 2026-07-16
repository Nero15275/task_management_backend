import { Types } from "mongoose";
import * as taskRepository from "./task.repository";
import * as taskPolicy from "./task.policy";
import { CreateTaskDto } from "./dto/createTask.dto";
import { UpdateTaskDto } from "./dto/updateTask.dto";
import { AppError, HTTP_STATUS, UserRole } from "@/common";
import { Task, TaskDocument } from "./task.model";
import * as UserRepository from "@/modules/user/user.repository";
import { UserDocument } from "../user/user.model";
import { AnyARecord } from "node:dns";

export async function createTask(
  user: { sub: string; role: UserRole },
  dto: CreateTaskDto
): Promise<TaskDocument> {
  let targetAssigneeId = user.sub;

  
  if (user.role === UserRole.EMPLOYEE) {
    targetAssigneeId = user.sub; 
  } else if (dto.assignedTo) {
    targetAssigneeId = dto.assignedTo;

    if (user.role === UserRole.TEAM_LEAD) {
      const assignedUser = await UserRepository.findById(targetAssigneeId);
      if (!assignedUser) {
        throw new AppError("Assigned user not found", HTTP_STATUS.NOT_FOUND);
      }

      const isDirectReport = assignedUser.reportsTo?.toString() === user.sub;
      const isSelf = targetAssigneeId === user.sub;

      if (!isDirectReport && !isSelf) {
        throw new AppError(
          "Forbidden: Team Leads can only assign tasks to team members or self",
          HTTP_STATUS.FORBIDDEN
        );
      }
    }
  }

  return taskRepository.create({
    title: dto.title,
    description: dto.description || "",
    assignedTo: new Types.ObjectId(targetAssigneeId) as any,
    createdBy: new Types.ObjectId(user.sub) as any,
  });
}

export async function getTasks(
  user: { sub: string; role: UserRole },
  filters?: { teamLeadId?: string }
): Promise<TaskDocument[]> {
  // 1. Manager: Fetch everything, or option to filter down to a specific Team Lead's squad 
  if (user.role === UserRole.MANAGER) {
    if (filters?.teamLeadId) {
      const teamMembers = await UserRepository.findByReportsTo(filters.teamLeadId );
      const teamUserIds = [filters.teamLeadId, ...teamMembers.map((m:any) => m._id.toString())];
      return taskRepository.findByAssignedUsers(teamUserIds);
    }
    return taskRepository.findAll();
  }

  // 2. Team Lead: Fetch tasks assigned to self + direct team reports 
  if (user.role === UserRole.TEAM_LEAD) {
    const teamMembers = await UserRepository.findByReportsTo(user.sub);
    const teamUserIds = [user.sub, ...teamMembers.map((m:any) => m._id.toString())];
    return taskRepository.findByAssignedUsers(teamUserIds);
  }

  // 3. Employee: Fetch only self-assigned tasks [cite: 17, 22]
  return taskRepository.findByAssignedUsers([user.sub]);
}

export async function updateTask(
  user: { sub: string; role: UserRole },
  taskId: string,
  dto: UpdateTaskDto
): Promise<TaskDocument> {
  const task = await taskRepository.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", HTTP_STATUS.NOT_FOUND);
  }

  const assignee = await UserRepository.findById(task.assignedTo.toString());
  const isDirectReport = assignee?.reportsTo?.toString() === user.sub;

  // Check RBAC mutation clearance 
  const hasPermission = taskPolicy.canUpdate(
    { sub: user.sub, role: user.role },
    { assignedTo: task.assignedTo.toString(), createdBy: task.createdBy.toString() },
    isDirectReport
  );

  if (!hasPermission) {
    throw new AppError("Forbidden: You do not have permissions to modify this task", HTTP_STATUS.FORBIDDEN);
  }

  // Reassignment boundaries validation [cite: 14, 16, 17]
  if (dto.assignedTo) {
    if (user.role === UserRole.EMPLOYEE) {
      throw new AppError("Forbidden: Employees cannot reassign tasks", HTTP_STATUS.FORBIDDEN);
    }
    if (user.role === UserRole.TEAM_LEAD) {
      const targetUser = await UserRepository.findById(dto.assignedTo.toString());
      const isTargetDirectReport = targetUser?.reportsTo?.toString() === user.sub;
      const isTargetSelf = dto.assignedTo === user.sub;

      if (!isTargetDirectReport && !isTargetSelf) {
        throw new AppError("Forbidden: Team Leads can only reassign to team members or self", HTTP_STATUS.FORBIDDEN);
      }
    }
  }

  const updatePayload: Partial<Task> = { ...dto } as any;
  if (dto.assignedTo) {
    updatePayload.assignedTo = new Types.ObjectId(dto.assignedTo) as any;
  }

  const updatedTask = await taskRepository.updateById(taskId, updatePayload);
  if (!updatedTask) {
    throw new AppError("Failed to update task", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  return updatedTask;
}

export async function deleteTask(
  user: { sub: string; role: UserRole },
  taskId: string
): Promise<boolean> {
  const task = await taskRepository.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", HTTP_STATUS.NOT_FOUND);
  }

  const hasPermission = taskPolicy.canDelete(
    { sub: user.sub, role: user.role },
    { assignedTo: task.assignedTo.toString() }
  );

  if (!hasPermission) {
    throw new AppError("Forbidden: You do not have permissions to delete this task", HTTP_STATUS.FORBIDDEN);
  }

  return taskRepository.deleteById(taskId);
}