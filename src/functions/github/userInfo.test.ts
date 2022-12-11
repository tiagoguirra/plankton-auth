import { mockApiEvent } from '../../mock/api.mock'
import { mockGitHubUser, mockGitHubUserEmails } from '../../mock/github.mock'
import { GitHubService } from '../../services/github/github.service'
import { ErrorAuthenticateException } from '../../types/exceptions'
import { handler } from './userInfo'

describe('User info handler suit test', () => {
  it('should return keys', async () => {
    expect.assertions(3)
    const mockUserInfo = {
      sub: `${mockGitHubUser.id}`, // OpenID requires a string
      name: mockGitHubUser.name,
      preferred_username: mockGitHubUser.login,
      profile: mockGitHubUser.html_url,
      picture: mockGitHubUser.avatar_url,
      website: mockGitHubUser.blog,
      updated_at: 1670544042,
      email: mockGitHubUserEmails[0].email,
      email_verified: mockGitHubUserEmails[0].verified
    }
    jest
      .spyOn(GitHubService.prototype, 'userInfo')
      .mockResolvedValue(mockUserInfo)
    const response = await handler({
      ...mockApiEvent,
      headers: {
        Authorization: 'Bearer token'
      }
    })
    expect(GitHubService.prototype.userInfo).toHaveBeenCalledWith(
      'Bearer token'
    )
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(JSON.stringify(mockUserInfo, null, 2))
  })

  it('should return error for exception', async () => {
    expect.assertions(2)
    jest
      .spyOn(GitHubService.prototype, 'userInfo')
      .mockRejectedValue(new ErrorAuthenticateException('Token expired'))

    const response = await handler({
      ...mockApiEvent,
      headers: {
        Authorization: 'Bearer token'
      }
    })

    expect(response.statusCode).toEqual(401)
    expect(response.body).toEqual(
      JSON.stringify(
        {
          errorType: 'AccessDenied',
          errorMessage: 'Token expired'
        },
        null,
        2
      )
    )
  })
})
