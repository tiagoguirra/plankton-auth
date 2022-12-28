import { UserIdentity } from '../types/identity'

export const identityMock: UserIdentity = {
  identityId: 'Github-staging_1234345',
  userId: '1234345',
  providerName: 'Github-staging',
  credentials: {
    access_token: 'access_token_1234455',
    scope: 'user',
    token_type: 'bearer',
    refresh_token: 'refresh_token_1234455'
  },
  updatedAt: '2022-12-01T00:00:00.000Z',
  createdAt: '2022-12-01T00:00:00.000Z'
}
