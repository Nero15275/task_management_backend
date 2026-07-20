import { getIO } from "./socket";
import { SocketEvents } from "./socket,events";

export function emitTaskCreated(
  userIds: string[],
  payload: unknown
): void {
  const io = getIO();

  userIds.forEach((userId) => {
    io.to(`user:${userId}`).emit(
      SocketEvents.TASK_CREATED,
      payload
    );
  });
}

export function emitTaskUpdated(
  userIds: string[],
  payload: unknown
): void {
  const io = getIO();

  userIds.forEach((userId) => {
    io.to(`user:${userId}`).emit(
      SocketEvents.TASK_UPDATED,
      payload
    );
  });
}

export function emitTaskDeleted(
  userIds: string[],
  taskId: string
): void {
  const io = getIO();

  userIds.forEach((userId) => {
    io.to(`user:${userId}`).emit(
      SocketEvents.TASK_DELETED,
      {
        taskId,
      }
    );
  });
}