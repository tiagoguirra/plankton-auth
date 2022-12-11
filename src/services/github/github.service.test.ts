import { mockGitHubCredentials } from '../../mock/secret.mock'
import { SecretManagerService } from '../secret/secret.service'
import JSONWebKey from 'json-web-key'
import jwt from 'jsonwebtoken'
import { GitHubService } from './github.service'
import axios, { AxiosRequestConfig } from 'axios'
import {
  mockGitHubAccessToken,
  mockGitHubUser,
  mockGitHubUserEmails
} from '../../mock/github.mock'

describe('GithubService suit test', () => {
  const githubService = new GitHubService()
  const mockIdToken = 'eyJhbGciOi'

  beforeAll(() => {
    jest
      .spyOn(SecretManagerService.prototype, 'getValue')
      .mockResolvedValue(mockGitHubCredentials)
    jest
      .spyOn(JSONWebKey, 'fromPEM')
      // @ts-expect-error
      .mockImplementation((certificate: string) => ({
        toJSON: () => ({ certId: 'ce' })
      }))

    jest.spyOn(jwt, 'sign').mockReturnValue(mockIdToken)
  })

  it('should return github credentials', async () => {
    expect.assertions(2)

    const response = await githubService.getCredentials()

    expect(SecretManagerService.prototype.getValue).toHaveBeenCalledWith(
      process.env.SECRET_GITHUB_ID
    )
    expect(response).toStrictEqual(mockGitHubCredentials)
  })

  it('should return jso web keys', async () => {
    expect.assertions(2)

    const jwk = await githubService.getJwks()

    expect(JSONWebKey.fromPEM).toHaveBeenCalledWith(
      mockGitHubCredentials.certificate_public
    )
    expect(jwk).toStrictEqual({
      keys: [
        {
          alg: 'RS256',
          kid: 'jwtRS256',
          certId: 'ce'
        }
      ]
    })
  })

  it('should return id token', () => {
    expect.assertions(2)

    const idToken = githubService.generateIdToken(
      mockGitHubCredentials.client_id,
      'localhost',
      mockGitHubCredentials.certificate_public
    )

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        iss: 'https://localhost',
        aud: mockGitHubCredentials.client_id
      },
      mockGitHubCredentials.certificate_public,
      {
        expiresIn: '1h',
        algorithm: 'RS256',
        keyid: 'jwtRS256'
      }
    )
    expect(idToken).toStrictEqual(mockIdToken)
  })

  it('should request and return access token', async () => {
    expect.assertions(4)

    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: mockGitHubAccessToken
    })

    const accessToken = await githubService.accessToken(
      '1f0d1b0c-1f0d-1b0c-1f0d-1b0c1f0d1b0c',
      'as20j1kj13',
      'localhost'
    )

    expect(SecretManagerService.prototype.getValue).toHaveBeenCalled()
    expect(jwt.sign).toHaveBeenCalled()
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.GITHUB_LOGIN_URL}/login/oauth/access_token`,
      {
        grant_type: 'authorization_code',
        redirect_uri: process.env.COGNITO_REDIRECT_URI,
        client_id: mockGitHubCredentials.client_id,
        client_secret: mockGitHubCredentials.client_secret,
        response_type: 'code',
        code: '1f0d1b0c-1f0d-1b0c-1f0d-1b0c1f0d1b0c',
        state: 'as20j1kj13'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    )
    expect(accessToken).toStrictEqual({
      ...mockGitHubAccessToken,
      id_token: 'eyJhbGciOi',
      scope: 'openid user emails'
    })
  })

  it('should return user info', async () => {
    expect.assertions(3)
    jest
      .spyOn(axios, 'get')
      .mockImplementation((url: string, config: AxiosRequestConfig<any>) => {
        if (url.includes('user/emails')) {
          return Promise.resolve({
            data: mockGitHubUserEmails
          })
        }
        return Promise.resolve({
          data: mockGitHubUser
        })
      })

    const userInfo = await githubService.userInfo(
      mockGitHubAccessToken.access_token
    )

    const config = {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${mockGitHubAccessToken.access_token}`
      }
    }

    expect(axios.get).toHaveBeenNthCalledWith(
      1,
      `${process.env.GITHUB_API_URL}/user`,
      config
    )
    expect(axios.get).toHaveBeenNthCalledWith(
      2,
      `${process.env.GITHUB_API_URL}/user/emails`,
      config
    )
    expect(userInfo).toStrictEqual({
      sub: `${mockGitHubUser.id}`, // OpenID requires a string
      name: mockGitHubUser.name,
      preferred_username: mockGitHubUser.login,
      profile: mockGitHubUser.html_url,
      picture: mockGitHubUser.avatar_url,
      website: mockGitHubUser.blog,
      updated_at: 1670544042,
      email: mockGitHubUserEmails[0].email,
      email_verified: mockGitHubUserEmails[0].verified
    })
  })
})
