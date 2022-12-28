import { APIGatewayEvent } from 'aws-lambda'
import { AuthClaims, AuthUser, AuthUserIdentity } from '../types/auth'
import { isDevelopmentEnv, isTestEnv } from './testFunctions'

const developUser: AuthClaims = {
  at_hash: 'l5A4CRrxgFk0LAwFJMcoQg',
  sub: 'd7a12d0d-cbf3-41df-ab0f-05eaa25f570d',
  email_verified: 'true',
  iss: 'https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_1RMJOWfmm',
  'cognito:username': 'mock@planktondoc.com',
  preferred_username: 'planktonUser',
  origin_jti: 'dasdasda',
  aud: 'sasdadad',
  identities:
    '{"dateCreated":"1672091661737","userId":"30501646","providerName":"Github-staging","providerType":"OIDC","issuer":null,"primary":"false"}',
  updated_at: '1670544042',
  token_use: 'id',
  auth_time: '1672184580',
  name: 'Plankton doc',
  exp: 'Wed Dec 28 04:43:00 UTC 2022',
  iat: 'Tue Dec 27 23:43:00 UTC 2022',
  jti: '10283553-4993-4e70-b1c2-255221c27d5c',
  email: 'mock@planktondoc.com'
}

const getAuthIdentity = (identities: string): AuthUserIdentity[] => {
  if (!identities) {
    return []
  }
  const identity = JSON.parse(identities)
  const identityArray = Array.isArray(identity) ? identity : [identity]

  return identityArray.map((i) => ({
    dateCreated: i.dateCreated,
    userId: i.userId,
    providerName: i.providerName,
    providerType: i.providerType,
    issuer: i.issuer,
    primary: i.primary
  }))
}

const getClaims = (event: APIGatewayEvent): AuthClaims => {
  const { requestContext } = event

  const claims: AuthClaims = requestContext?.authorizer?.claims

  if (isDevelopmentEnv() || isTestEnv()) {
    return developUser
  }
  return claims
}

const getAuthUser = (event: APIGatewayEvent): AuthUser => {
  const claims: AuthClaims = getClaims(event)
  return {
    at_hash: claims?.at_hash,
    sub: claims?.sub,
    email_verified: claims?.email_verified,
    profile: claims?.profile,
    iss: claims?.iss,
    'cognito:username': claims['cognito:username'],
    preferred_username: claims?.preferred_username,
    nonce: claims?.nonce,
    picture: claims?.picture,
    origin_jti: claims?.origin_jti,
    aud: claims?.aud,
    identities: getAuthIdentity(claims?.identities),
    updated_at: Number(claims?.updated_at),
    token_use: claims?.token_use,
    auth_time: Number(claims?.auth_time),
    name: claims?.name,
    exp: claims?.exp,
    iat: claims?.iat,
    jti: claims?.jti,
    email: claims?.email
  }
}

export { getAuthUser }
