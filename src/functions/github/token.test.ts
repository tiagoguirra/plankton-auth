import { mockApiEvent } from '../../mock/api.mock'
import { mockGitHubAccessToken } from '../../mock/github.mock'
import githubService from '../../services/github/github.service'
import { InvalidArgumentException } from '../../types/exceptions'
import { handler } from './token'

describe('Json web keys handler suit test', () => {
  it('should return access token', async () => {
    expect.assertions(3)
    jest.spyOn(githubService, 'accessToken').mockResolvedValue({
      ...mockGitHubAccessToken,
      id_token: 'eyJhbGciOi',
      scope: 'openid user emails'
    })
    const response = await handler({
      ...mockApiEvent,
      headers: {
        Host: 'localhost:3000',
        'Content-Type': 'application/json'
      },
      requestContext: {
        ...mockApiEvent.requestContext,
        stage: 'test'
      },
      body: JSON.stringify({
        code: '132344',
        state: 'as20j1kj13',
        client_id: '48cb54f1-42fd-4a69-8797-b455e1060a7b',
        client_secret: '48cb54f1-42fd-4a69-8797-b455e1060a7b',
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000'
      })
    })
    expect(githubService.accessToken).toHaveBeenCalledWith(
      {
        code: '132344',
        state: 'as20j1kj13',
        client_id: '48cb54f1-42fd-4a69-8797-b455e1060a7b',
        client_secret: '48cb54f1-42fd-4a69-8797-b455e1060a7b',
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000'
      },
      'localhost:3000/test'
    )

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      JSON.stringify(
        {
          ...mockGitHubAccessToken,
          id_token: 'eyJhbGciOi',
          scope: 'openid user emails'
        },
        null,
        2
      )
    )
  })

  it('should return error for exception', async () => {
    expect.assertions(2)
    jest
      .spyOn(githubService, 'accessToken')
      .mockRejectedValue(new InvalidArgumentException('Error  from github'))

    const response = await handler({
      ...mockApiEvent,
      headers: {
        Host: 'localhost:3000'
      },
      requestContext: {
        ...mockApiEvent.requestContext,
        stage: 'test'
      },
      body: JSON.stringify({
        code: '132344',
        state: 'as20j1kj13',
        client_id: '48cb54f1-42fd-4a69-8797-b455e1060a7b',
        client_secret: '48cb54f1-42fd-4a69-8797-b455e1060a7b',
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000'
      })
    })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(
      JSON.stringify(
        {
          errorType: 'BadRequest',
          errorMessage: 'Error  from github'
        },
        null,
        2
      )
    )
  })
})
