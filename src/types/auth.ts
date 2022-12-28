export interface AuthClaims {
  at_hash?: string
  sub: string
  email_verified: string
  profile?: string
  iss: string
  'cognito:username': string
  preferred_username?: string
  nonce?: string
  picture?: string
  origin_jti: string
  aud: string
  identities?: string
  updated_at: string
  token_use: string
  auth_time: string
  name: string
  exp: string
  iat: string
  jti: string
  email: string
}

export interface AuthUser {
  at_hash?: string
  sub: string
  email_verified: string
  profile?: string
  iss: string
  'cognito:username': string
  preferred_username?: string
  nonce?: string
  picture?: string
  origin_jti: string
  aud: string
  identities?: AuthUserIdentity[]
  updated_at: number
  token_use: string
  auth_time: number
  name: string
  exp: string
  iat: string
  jti: string
  email: string
}

export interface AuthUserIdentity {
  dateCreated: number
  userId: string
  providerName: string
  providerType: string
  issuer?: string
  primary: string
}
