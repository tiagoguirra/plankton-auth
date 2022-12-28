import axios from 'axios'
import {
  GithubCredentials,
  GithubEmail,
  GithubError,
  GithubUser
} from '../../types/github'
import { OAuthToken, OAuthUser } from '../../types/oauth'
import jwt from 'jsonwebtoken'
import JSONWebKey from 'json-web-key'
import { NumericDate } from '../../utils/date'
import { OpenIDJwks, OpenIDTokenRequest } from '../../types/openid'
import secretService from '../secret/secret.service'
import certificateService from '../certificate/certificate.service'
import { ErrorAuthenticateException } from '../../types/exceptions'
import identityService from '../identity/identity.service'

class GitHubService {
  getCredentials(): Promise<GithubCredentials> {
    return secretService.getValue<GithubCredentials>(
      process.env.SECRET_GITHUB_ID,
      true
    )
  }

  async getJwks(): Promise<OpenIDJwks> {
    const certificatePublic = await certificateService.public()

    const certificateKeys = JSONWebKey.fromPEM(certificatePublic).toJSON()
    const key = {
      alg: 'RS256',
      kid: 'jwtRS256',
      ...certificateKeys
    }

    return {
      keys: [key]
    }
  }

  generateIdToken(clientId: string, host: string, certificate: string): string {
    const payload = {
      iss: `https://${host}`,
      aud: clientId
    }
    return jwt.sign(payload, certificate, {
      expiresIn: '1h',
      algorithm: 'RS256',
      keyid: 'jwtRS256'
    })
  }

  async saveIdentity(credentials: OAuthToken): Promise<void> {
    const { data: user } = await axios.get<GithubUser | GithubError>(
      `${process.env.GITHUB_API_URL}/user`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${credentials.access_token}`
        }
      }
    )

    if ('error' in user) {
      console.error(user)
      throw new ErrorAuthenticateException(user.error_description)
    }

    await identityService.update(
      process.env.GITHUB_PROVIDER_NAME,
      String(user.id),
      credentials
    )
  }

  async accessToken(
    client: OpenIDTokenRequest,
    issuer: string
  ): Promise<OAuthToken> {
    const certificate = await certificateService.key()

    const { data } = await axios.post<OAuthToken | GithubError>(
      `${process.env.GITHUB_LOGIN_URL}/login/oauth/access_token`,
      {
        grant_type: 'authorization_code',
        redirect_uri: client.redirect_uri,
        client_id: client.client_id,
        client_secret: client.client_secret,
        response_type: 'code',
        code: client.code,
        state: client.state
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    )

    if ('error' in data) {
      console.error(data)
      throw new ErrorAuthenticateException(data.error_description)
    }

    const idToken = this.generateIdToken(client.client_id, issuer, certificate)
    const scope = `openid ${data.scope.replace(',', ' ')}`

    const credentials = {
      ...data,
      scope,
      id_token: idToken
    }

    await this.saveIdentity(credentials)

    return credentials
  }

  async userInfo(accessToken: string): Promise<OAuthUser> {
    const config = {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${accessToken}`
      }
    }

    const [{ data: user }, { data: emails }] = await Promise.all([
      axios.get<GithubUser | GithubError>(
        `${process.env.GITHUB_API_URL}/user`,
        config
      ),
      axios.get<GithubEmail[] | GithubError>(
        `${process.env.GITHUB_API_URL}/user/emails`,
        config
      )
    ])

    if ('error' in user) {
      console.error(user)
      throw new ErrorAuthenticateException(user.error_description)
    }

    if ('error' in emails) {
      console.error(emails)
      throw new ErrorAuthenticateException(emails.error_description)
    }

    const primaryEmail = emails.find((email) => email.primary)

    return {
      sub: `${user.id}`, // OpenID requires a string
      name: user.name,
      preferred_username: user.login,
      profile: user.html_url,
      picture: user.avatar_url,
      website: user.blog,
      updated_at: NumericDate(
        // OpenID requires the seconds since epoch in UTC
        Date.parse(user.updated_at)
      ),
      email: primaryEmail.email,
      email_verified: primaryEmail.verified,
      token: accessToken
    }
  }
}

export default new GitHubService()
