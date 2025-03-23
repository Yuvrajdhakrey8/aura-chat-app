import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/chats" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to={"/auth"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
