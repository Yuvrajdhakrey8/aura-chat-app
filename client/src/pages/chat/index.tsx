import { RoutesEnum } from "@/routes/const";
import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.isSetUpComplete) {
      navigate(RoutesEnum.PROFILE);
    }
  }, []);

  return (
    <>
      <div>Chats</div>
    </>
  );
};

export default Chat;
