export interface IOToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export interface IJwtSet {
  accessToken: string;
  accessExpiry: number;
  refreshToken: string;
  refreshExpiry: number;
}
