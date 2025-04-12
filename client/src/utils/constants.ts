import axios from "axios";
export const HOST = import.meta.env.VITE_SERVER_URL;

export enum Routes {
  AUTH_ROUTES = "api/auth",
  CONTACT_ROUTES = "api/contacts",
}

export const axiosClient = axios.create({
  baseURL: HOST,
});

export enum ChatTypes {
  CONTACTS = "contacts",
  CHANNEL = "channel",
}
