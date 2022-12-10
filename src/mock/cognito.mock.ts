import { AuthenticationResult } from '../types/signin'

export const mockAuthentication: AuthenticationResult = {
  AccessToken: 'mockAccessToken',
  ExpiresIn: 3600,
  IdToken: 'mockIdToken',
  RefreshToken: 'mockRefreshToken',
  TokenType: 'Bearer'
}
