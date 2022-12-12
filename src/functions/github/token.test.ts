import { mockApiEvent } from '../../mock/api.mock'
import { mockGitHubAccessToken } from '../../mock/github.mock'
import { GitHubService } from '../../services/github/github.service'
import { InvalidArgumentException } from '../../types/exceptions'
import { handler } from './token'

describe('Json web keys handler suit test', () => {
  it('should return access token', async () => {
    expect.assertions(3)
    jest.spyOn(GitHubService.prototype, 'accessToken').mockResolvedValue({
      ...mockGitHubAccessToken,
      id_token: 'eyJhbGciOi',
      scope: 'openid user emails'
    })
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
        state: 'as20j1kj13'
      })
    })
    expect(GitHubService.prototype.accessToken).toHaveBeenCalledWith(
      '132344',
      'as20j1kj13',
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
      .spyOn(GitHubService.prototype, 'accessToken')
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
        state: 'as20j1kj13'
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
