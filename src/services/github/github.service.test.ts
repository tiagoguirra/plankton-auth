import {
  mockCertificateKey,
  mockCertificatePub,
  mockGitHubCredentials
} from '../../mock/secret.mock'
import JSONWebKey from 'json-web-key'
import jwt from 'jsonwebtoken'
import axios, { AxiosRequestConfig } from 'axios'
import {
  mockGitHubAccessToken,
  mockGitHubUser,
  mockGitHubUserEmails
} from '../../mock/github.mock'
import secretService from '../secret/secret.service'
import githubService from './github.service'
import certificateService from '../certificate/certificate.service'
import { ErrorAuthenticateException } from '../../types/exceptions'

describe('GithubService suit test', () => {
  const mockIdToken = 'eyJhbGciOi'

  beforeAll(() => {
    jest
      .spyOn(secretService, 'getValue')
      .mockResolvedValue(mockGitHubCredentials)
    jest
      .spyOn(JSONWebKey, 'fromPEM')
      // @ts-expect-error
      .mockImplementation((certificate: string) => ({
        toJSON: () => ({ certId: 'ce' })
      }))

    jest.spyOn(jwt, 'sign').mockReturnValue(mockIdToken)
    jest
      .spyOn(certificateService, 'public')
      .mockResolvedValue(mockCertificatePub)
    jest.spyOn(certificateService, 'key').mockResolvedValue(mockCertificateKey)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return github credentials', async () => {
    expect.assertions(2)

    const response = await githubService.getCredentials()

    expect(secretService.getValue).toHaveBeenCalledWith(
      process.env.SECRET_GITHUB_ID,
      true
    )
    expect(response).toStrictEqual(mockGitHubCredentials)
  })

  it('should return jso web keys', async () => {
    expect.assertions(2)

    const jwk = await githubService.getJwks()

    expect(JSONWebKey.fromPEM).toHaveBeenCalledWith(mockCertificatePub)
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
      mockCertificateKey
    )

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        iss: 'https://localhost',
        aud: mockGitHubCredentials.client_id
      },
      mockCertificateKey,
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
      {
        code: '132344',
        state: 'as20j1kj13',
        client_id: '48cb54f1-42fd-4a69-8797-b455e1060a7b',
        client_secret: '48cb54f1-42fd-4a69-8797-b455e1060a7b',
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000'
      },
      'localhost'
    )

    expect(certificateService.key).toHaveBeenCalled()
    expect(jwt.sign).toHaveBeenCalled()
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.GITHUB_LOGIN_URL}/login/oauth/access_token`,
      {
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000',
        client_id: '48cb54f1-42fd-4a69-8797-b455e1060a7b',
        client_secret: '48cb54f1-42fd-4a69-8797-b455e1060a7b',
        response_type: 'code',
        code: '132344',
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

  it('should return exception from token response', async () => {
    expect.assertions(1)

    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        error: 'error',
        error_description: 'Code is invalid'
      }
    })

    await expect(
      githubService.accessToken(
        {
          code: '0',
          state: 'as20j1kj13',
          client_id: '48cb54f1-42fd-4a69-8797-b455e1060a7b',
          client_secret: '48cb54f1-42fd-4a69-8797-b455e1060a7b',
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost:3000'
        },
        'localhost'
      )
    ).rejects.toThrow(new ErrorAuthenticateException('Code is invalid'))
  })

  it('should return exception from userInfo response', async () => {
    expect.assertions(1)
    jest
      .spyOn(axios, 'get')
      .mockImplementation((url: string, config: AxiosRequestConfig<any>) => {
        if (url.includes('user/emails')) {
          return Promise.resolve({
            data: mockGitHubUserEmails
          })
        }
        return Promise.resolve({
          data: {
            error: 'error',
            error_description: 'Token is invalid'
          }
        })
      })

    await expect(githubService.userInfo('token')).rejects.toThrow(
      new ErrorAuthenticateException('Token is invalid')
    )
  })

  it('should return exception from userEmail response', async () => {
    expect.assertions(1)

    jest
      .spyOn(axios, 'get')
      .mockImplementation((url: string, config: AxiosRequestConfig<any>) => {
        if (url.includes('user/emails')) {
          return Promise.resolve({
            data: {
              error: 'error',
              error_description: 'Permission invalid'
            }
          })
        }
        return Promise.resolve({
          data: mockGitHubUser
        })
      })

    await expect(githubService.userInfo('token')).rejects.toThrow(
      new ErrorAuthenticateException('Permission invalid')
    )
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
      email_verified: mockGitHubUserEmails[0].verified,
      token: mockGitHubAccessToken.access_token
    })
  })
})
