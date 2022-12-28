import { OAuthToken } from './oauth'

export interface UserIdentity {
  identityId: string
  userId: string
  providerName: string
  credentials: OAuthToken
  createdAt: string
  updatedAt: string
}
