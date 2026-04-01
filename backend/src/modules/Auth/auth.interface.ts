export type TLoginUser = {
  email: string;
  password?: string;
};

export type TJwtPayload = {
  id: string;
  email: string;
  role: string;
};