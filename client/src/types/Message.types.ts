import { IUserData } from "./Auth.types";

export interface IMessageData {
  _id: string;
  sender: IUserData;
  recipient?: IUserData;
  messageType: MESSAGE_TYPE;
  content?: string;
  fileUrl?: string;
  channelId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum MESSAGE_TYPE {
  TEXT = "text",
  FILE = "file",
}
