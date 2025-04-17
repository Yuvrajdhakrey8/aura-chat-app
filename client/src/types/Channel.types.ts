export interface IChannelPayload {
  name: string;
  members: string[];
}

export interface IChannelData {
  _id: string;
  name: string;
  members: string[];
  admin: string;
  messages: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
