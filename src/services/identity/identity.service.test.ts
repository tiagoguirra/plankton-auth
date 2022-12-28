import identityService from './identity.service'

describe('IdentityService suit test', () => {
  it('should create a new identity', async () => {
    expect.assertions(1)
    const identity = await identityService.update('Github', '1234455', {
      access_token: 'access_token_1234455',
      scope: 'user',
      token_type: 'bearer',
      refresh_token: 'refresh_token_1234455'
    })
    expect(identity).toStrictEqual({
      identityId: 'Github_1234455',
      userId: '1234455',
      providerName: 'Github',
      credentials: {
        access_token: 'access_token_1234455',
        scope: 'user',
        token_type: 'bearer',
        refresh_token: 'refresh_token_1234455'
      },
      updatedAt: expect.any(String),
      createdAt: expect.any(String)
    })
  })

  it('should update identity', async () => {
    expect.assertions(1)
    const identity = await identityService.update('Github-staging', '1234345', {
      access_token: 'access_token_1234455',
      scope: 'user',
      token_type: 'bearer',
      refresh_token: 'refresh_token_1234455'
    })
    expect(identity).toStrictEqual({
      identityId: 'Github-staging_1234345',
      userId: '1234345',
      providerName: 'Github-staging',
      credentials: {
        access_token: 'access_token_1234455',
        scope: 'user',
        token_type: 'bearer',
        refresh_token: 'refresh_token_1234455'
      },
      updatedAt: expect.any(String),
      createdAt: expect.any(String)
    })
  })

  it('should get identity', async () => {
    expect.assertions(1)
    const identity = await identityService.getByProvider(
      'Github-staging',
      '1234345'
    )
    expect(identity).toStrictEqual({
      identityId: 'Github-staging_1234345',
      userId: '1234345',
      providerName: 'Github-staging',
      credentials: {
        access_token: 'token',
        refresh_token: 'refresh',
        token_type: 'bearer',
        scope: 'user:email'
      },
      updatedAt: '2022-12-01T00:00:00.000Z',
      createdAt: '2022-12-01T00:00:00.000Z'
    })
  })
})
