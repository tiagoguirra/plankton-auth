import { CognitoIdentityServiceProvider } from 'aws-sdk'
import {
  CognitoException,
  InvalidArgumentException
} from '../../types/exceptions'
import { SignUp } from '../../types/signup'

export class SignUpService {
  readonly cognito: CognitoIdentityServiceProvider

  constructor() {
    this.cognito = new CognitoIdentityServiceProvider()
  }

  async byEmail(user: SignUp): Promise<void> {
    try {
      await this.cognito
        .signUp({
          Username: user.email,
          Password: user.password,
          ClientId: process.env.USER_CLIENT_ID,
          UserAttributes: [
            {
              Name: 'email',
              Value: user.email
            },
            {
              Name: 'name',
              Value: user.name
            }
          ]
        })
        .promise()
    } catch (err) {
      if ((err as CognitoException).code === 'UsernameExistsException') {
        throw new InvalidArgumentException('signup.UserAlreadyExists')
      }
      throw new Error((err as Error)?.message)
    }
  }
}
