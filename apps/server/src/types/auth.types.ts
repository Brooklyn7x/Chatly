export interface ILoginDto {
  email: string;
  password: string;
}

export interface IRegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: {
    id: any;
    name: string;
    email: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
