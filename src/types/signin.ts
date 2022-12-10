export interface SignIn {
  username: string
  password: string
}

export interface AuthenticationResult {
  AccessToken: string
  ExpiresIn: number
  TokenType: string
  RefreshToken: string
  IdToken?: string
}
