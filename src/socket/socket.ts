import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "@/config";

let io: Server;

export function initializeSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
    transports: ["websocket"],
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
}