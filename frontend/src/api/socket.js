import { io } from "socket.io-client";
import { API_URL } from "./client";

let socket;

export function getSocket(token) {
  if (!socket || socket.auth?.token !== token) {
    socket?.disconnect();
    socket = io(API_URL, { auth: { token }, transports: ["websocket"] });
  }
  return socket;
}
