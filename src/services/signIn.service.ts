import { CognitoIdentityServiceProvider } from 'aws-sdk'
import {
  CognitoException,
  ErrorAuthenticateException,
  NotFoundException
} from '../types/exceptions'
import { AuthenticationResult, SignIn } from '../types/signin'

export class SignInService {
  readonly cognito: CognitoIdentityServiceProvider

  constructor() {
    this.cognito = new CognitoIdentityServiceProvider()
  }

  async emailAndPassword(user: SignIn): Promise<AuthenticationResult> {
    try {
      const { AuthenticationResult } = await this.cognito
        .initiateAuth({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: process.env.USER_CLIENT_ID,
          AuthParameters: {
            USERNAME: user.username,
            PASSWORD: user.password
          }
        })
        .promise()

      return AuthenticationResult as AuthenticationResult
    } catch (err) {
      const code = (err as CognitoException)?.code
      if (code === 'UserNotFoundException') {
        throw new NotFoundException('signin.UserNotFound')
      }
      if (code === 'NotAuthorizedException') {
        throw new ErrorAuthenticateException('signin.NotAuthorized')
      }
      if (code === 'UserNotConfirmedException') {
        throw new ErrorAuthenticateException('signin.UserNotConfirmed')
      }
      throw new Error((err as Error)?.message)
    }
  }
}
