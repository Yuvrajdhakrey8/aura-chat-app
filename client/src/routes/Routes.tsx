import { useAppStore } from "@/store";
import { Navigate } from "react-router-dom";
import Auth from "@/pages/auth";
import Chat from "@/pages/chat";
import Profile from "@/pages/profile";
import { AppRoute, RouteGuardProps, RoutesEnum } from "./const";

export const appRoutes: AppRoute[] = [
  { path: RoutesEnum.AUTH, element: <Auth />, isPrivate: false },
  { path: RoutesEnum.CHATS, element: <Chat />, isPrivate: true },
  { path: RoutesEnum.SETTINGS, element: <Auth />, isPrivate: true },
  { path: RoutesEnum.PROFILE, element: <Profile />, isPrivate: true },
];

export const RouteGuard = ({ children, isPrivate }: RouteGuardProps) => {
  const { userInfo } = useAppStore();

  const isAuthenticated = !!userInfo;

  if (!isAuthenticated && isPrivate) return <Navigate to={RoutesEnum.AUTH} />;

  return children;
};
