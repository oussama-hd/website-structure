export class Token {
  accessToken: string;
  token_type: string;
  expires_in: number;
  scope: string;
  jti: string;

  constructor(
    access_token: string,
    token_type: string,
    expires_in: number,
    scope: string,
    jti: string
  ) {
    this.accessToken = access_token;
    this.token_type = token_type;
    this.expires_in = expires_in;
    this.scope = scope;
    this.jti = jti;
  }
}
