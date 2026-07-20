import { NextFunction, Request, Response } from "express";
import * as taskService from "./task.service";
import { createTaskSchema } from "./dto/createTask.dto";
import { updateTaskSchema } from "./dto/updateTask.dto";
import { AppError, HTTP_STATUS } from "@/common";
import { getTaskReceivers } from "@/common/utils/Helper";
import { emitTaskCreated, emitTaskDeleted, emitTaskUpdated } from "@/socket/socket.service";

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }


    const task = await taskService.createTask(
      { sub: req.user.sub, role: req.user.role },
      req.body
    );
    if(task.assignedTo){
      const receivers = await getTaskReceivers(task.assignedTo._id);

      emitTaskCreated(receivers, task);
  }

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const teamLeadId = req.query.teamLeadId as string | undefined;

    const tasks = await taskService.getTasks(
      { sub: req.user.sub, role: req.user.role },
      { teamLeadId }
    );

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }
    console.log("req.user", req.user);
    console.log("req.params", req.params);
    const { id } = req.params;
    

    const task = await taskService.updateTask(
      { sub: req.user.sub, role: req.user.role },
      id.toString(),
      req.body
    );
    
    if(task.assignedTo){
      const receivers = await getTaskReceivers(task.assignedTo._id);

      emitTaskUpdated(receivers, task);
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const { id } = req.params;

    const deletedTask = await taskService.deleteTask({ sub: req.user.sub, role: req.user.role }, id as string);
    if(deletedTask && deletedTask.assignedTo){

       const receivers = await getTaskReceivers(deletedTask.assignedTo);
       emitTaskDeleted(receivers, deletedTask._id.toString());
    }

    res.status(200).json({ success: true, message: "Task successfully deleted" });
  } catch (error) {
    next(error);
  }
}