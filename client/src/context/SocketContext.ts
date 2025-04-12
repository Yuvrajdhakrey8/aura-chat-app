import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export interface ISocketContext {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

export const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};
