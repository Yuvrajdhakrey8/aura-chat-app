export interface ISignupAuthPayload {
  email: string;
  password: string;
}

export interface IUserData {
  _id: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  isSetUpComplete: boolean;
}
