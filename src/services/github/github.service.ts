import axios from 'axios'
import { GithubCredentials, GithubEmail, GithubUser } from '../../types/github'
import { OAuthToken, OAuthUser } from '../../types/oauth'
import { SecretManagerService } from '../secret/secret.service'
import jwt from 'jsonwebtoken'
import JSONWebKey from 'json-web-key'
import { NumericDate } from '../../utils/date'
import { OpenIDJwks } from '../../types/openid'

export class GitHubService {
  getCredentials(): Promise<GithubCredentials> {
    const secretManager = new SecretManagerService()
    return secretManager.getValue<GithubCredentials>(
      process.env.SECRET_GITHUB_ID
    )
  }

  async getJwks(): Promise<OpenIDJwks> {
    const { certificate_public: certificatePublic } =
      await this.getCredentials()

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

  generateIdToken(
    clientId: string,
    host: string,
    certificatePublic: string
  ): string {
    const payload = {
      iss: `https://${host}`,
      aud: clientId
    }
    return jwt.sign(payload, certificatePublic, {
      expiresIn: '1h',
      algorithm: 'RS256',
      keyid: 'jwtRS256'
    })
  }

  async accessToken(
    code: string,
    state: string,
    issuer: string
  ): Promise<OAuthToken> {
    const {
      client_id: clientId,
      client_secret: clientSecret,
      certificate_public: certificatePublic
    } = await this.getCredentials()

    const { data } = await axios.post<OAuthToken>(
      `${process.env.GITHUB_LOGIN_URL}/login/oauth/access_token`,
      {
        grant_type: 'authorization_code',
        redirect_uri: process.env.COGNITO_REDIRECT_URI,
        client_id: clientId,
        client_secret: clientSecret,
        response_type: 'code',
        code,
        state
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    )
    const idToken = this.generateIdToken(clientId, issuer, certificatePublic)
    const scope = `openid ${data.scope.replace(',', ' ')}`

    return {
      ...data,
      scope,
      id_token: idToken
    }
  }

  async userInfo(accessToken: string): Promise<OAuthUser> {
    const config = {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${accessToken}`
      }
    }

    const [{ data: user }, { data: emails }] = await Promise.all([
      axios.get<GithubUser>(`${process.env.GITHUB_API_URL}/user`, config),
      axios.get<GithubEmail[]>(
        `${process.env.GITHUB_API_URL}/user/emails`,
        config
      )
    ])

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
      email_verified: primaryEmail.verified
    }
  }
}
