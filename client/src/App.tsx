import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { appRoutes, RouteGuard } from "./routes/Routes";
import { RoutesEnum } from "./routes/const";
import { useAppStore } from "./store";
import { getUserData } from "./services/AuthServices";
import { ApiResponse } from "./types/common.types";
import { IUserData } from "./types/Auth.types";

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setUserInfo, setIsInfoLoaded } = useAppStore();

  const getUserInfo = () => {
    getUserData()
      .then((res) => {
        const { msg, success, data } = res as ApiResponse<IUserData>;

        if (!success) throw new Error(msg);

        if (success && data) {
          setUserInfo(data);
        } else {
          setUserInfo(undefined);
        }
      })
      .catch((err: Error) => {
        console.log("getUserInfo", err);
      })
      .finally(() => {
        setLoading(false);
        setIsInfoLoaded(true);
      });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map(({ path, element, isPrivate }) => (
          <Route
            key={path}
            path={path}
            element={<RouteGuard isPrivate={isPrivate}>{element}</RouteGuard>}
          />
        ))}
        <Route path="*" element={<Navigate to={RoutesEnum.AUTH} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
