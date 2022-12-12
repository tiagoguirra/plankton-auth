import { mockApiEvent } from '../../mock/api.mock'
import { mockGitHubCredentials } from '../../mock/secret.mock'
import { handler } from './authorizer'
describe('Authorizer handler suit test', () => {
  it('should redirect to github login', async () => {
    expect.assertions(1)

    const response = await handler({
      ...mockApiEvent,
      queryStringParameters: {
        client_id: mockGitHubCredentials.client_id,
        scope: 'user emails',
        state: 'as20j1kj13',
        response_type: 'code'
      }
    })

    expect(response).toStrictEqual({
      statusCode: 302,
      headers: {
        Location: `${process.env.GITHUB_LOGIN_URL}/login/oauth/authorize?client_id=${mockGitHubCredentials.client_id}&scope=user%20emails&state=as20j1kj13&response_type=code`
      }
    })
  })
})
