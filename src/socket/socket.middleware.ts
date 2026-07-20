import { verifyAccessToken } from "@/modules/auth/jwt/jwt.service";
import { ExtendedError, Socket } from "socket.io";
import { AuthenticatedSocket } from "./socket.type";

export function socketAuthentication(
  socket: Socket,
  next: (err?: ExtendedError) => void
): void {
   try {

    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const payload = verifyAccessToken(token);

    (socket as AuthenticatedSocket).user = {
      sub: payload.sub,
      role: payload.role,
    };

    next();

  } catch {

    next(new Error("Unauthorized"));

  }
}