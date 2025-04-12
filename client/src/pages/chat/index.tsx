import { RoutesEnum } from "@/routes/const";
import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import ChatsContainer from "./components/ChatsContainer";
import EmptyChatsContainer from "./components/EmptyChatsContainer";
import ContactsContainer from "./components/ContactsContainer";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  const { selectedChatType } = useAppStore();

  useEffect(() => {
    if (!userInfo?.isSetUpComplete) {
      navigate(RoutesEnum.PROFILE);
    }
  }, []);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatsContainer />
      ) : (
        <ChatsContainer />
      )}
    </div>
  );
};

export default Chat;
