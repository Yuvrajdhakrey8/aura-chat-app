import { ReactNode } from "react";

export enum RoutesEnum {
  AUTH = "/auth",
  CHATS = "/chats",
  PROFILE = "/profile",
  SETTINGS = "/settings",
}

export interface RouteGuardProps {
  children: ReactNode;
  isPrivate: boolean;
}

export interface AppRoute {
  path: RoutesEnum;
  element: ReactNode;
  isPrivate: boolean;
}
