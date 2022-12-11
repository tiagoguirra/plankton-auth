export interface OAuthToken {
  access_token: string
  scope: string
  token_type: string
  id_token?: string
}

export interface OAuthUser {
  sub: string
  name: string
  email?: string
  preferred_username: string
  profile: string
  picture: string
  website: string
  updated_at: number
  email_verified: boolean
}

export interface OAuthService extends OAuthToken {
  userId: string
  provider: string
}

export interface OauthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  tokenEnpoint: string
}
