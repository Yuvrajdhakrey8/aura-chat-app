import { RoutesEnum } from "@/routes/const";
import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import ChatsContainer from "./components/ChatsContainer";
import EmptyChatsContainer from "./components/EmptyChatsContainer";
import ContactsContainer from "./components/ContactsContainer";

const Chat = () => {
  const {
    userInfo,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();
  const { selectedChatType } = useAppStore();

  useEffect(() => {
    if (!userInfo?.isSetUpComplete) {
      navigate(RoutesEnum.PROFILE);
    }
  }, []);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg ">
          <h5 className="text-5xl animate-pulse">Uploading file</h5>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg ">
          <h5 className="text-5xl animate-pulse">Downloading file</h5>
          {fileDownloadProgress}%
        </div>
      )}
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
