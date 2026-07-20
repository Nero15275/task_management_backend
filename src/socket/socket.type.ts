import { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
  user: {
    sub: string;
    role: string;
  };
}