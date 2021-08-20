export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IToken {
  token: string;
  expire: number;
}

export interface ITokenPayload {
  uid: string;
  email: string;
  nickname: string;
  iat: number;
  exp: number;
}
