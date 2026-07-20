import { Server } from "socket.io";
import { SocketEvents } from "./socket,events";
import { socketAuthentication } from "./socket.middleware";
import { AuthenticatedSocket } from "./socket.type";


export function registerSocketEvents(io: Server): void {

  io.use(socketAuthentication);

  io.on(SocketEvents.CONNECTION, (socket: any) => {

    socket.join(`user:${socket.user.sub}`);

    console.log(
      `${socket.user.sub} connected`
    );

    socket.on(SocketEvents.DISCONNECT, () => {

      console.log(
        `${socket.user.sub} disconnected`
      );

    });

  });

}