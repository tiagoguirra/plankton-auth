import { PreSignUp } from '../../types/cognito'
import { generatePassword } from '../../utils/password'
import { CognitoService } from './cognito.service'

export class CognitoTriggerService {
  cognito: CognitoService

  constructor(userPoolId: string) {
    this.cognito = new CognitoService(userPoolId)
  }

  async preSignUpExternalProvider({
    name,
    username,
    email
  }: PreSignUp): Promise<void> {
    const users = await this.cognito.listByEmail(email)
    const [providerNameValue, providerUserId] = username.split('_')

    const providerName =
      providerNameValue.charAt(0).toUpperCase() + providerNameValue.slice(1)

    if (users && users.length > 0) {
      // user already has cognito account
      const cognitoUsername = users[0].Username || 'username-not-found'

      await this.cognito.linkUserAccounts(
        providerName,
        providerUserId,
        cognitoUsername
      )
    } else {
      const createdCognitoUser = await this.cognito.createUser({
        email,
        name
      })

      await this.cognito.setPassword(email, generatePassword())

      const cognitoNativeUsername =
        createdCognitoUser?.Username || 'username-not-found'

      await this.cognito.linkUserAccounts(
        providerName,
        providerUserId,
        cognitoNativeUsername
      )

      await this.cognito.addUserToGroup(cognitoNativeUsername, 'Users')
    }
  }
}
