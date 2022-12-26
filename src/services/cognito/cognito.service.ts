import { CognitoIdentityServiceProvider } from 'aws-sdk'
import { CreateUser } from '../../types/cognito'
export class CognitoService {
  cognito: CognitoIdentityServiceProvider

  constructor(private readonly userPoolId: string) {
    this.cognito = new CognitoIdentityServiceProvider()
  }

  async listByEmail(
    email: string
  ): Promise<CognitoIdentityServiceProvider.UsersListType> {
    const { Users } = await this.cognito
      .listUsers({
        UserPoolId: this.userPoolId,
        Filter: `email = "${email}"`
      })
      .promise()

    return Users
  }

  async linkUserAccounts(
    providerName: string,
    providerUserId: string,
    username: string
  ): Promise<void> {
    const params = {
      DestinationUser: {
        ProviderAttributeValue: username,
        ProviderName: 'Cognito'
      },
      SourceUser: {
        ProviderAttributeName: 'Cognito_Subject',
        ProviderAttributeValue: providerName,
        ProviderName: providerUserId
      },
      UserPoolId: this.userPoolId
    }

    await this.cognito.adminLinkProviderForUser(params).promise()
  }

  async createUser(
    user: CreateUser
  ): Promise<CognitoIdentityServiceProvider.UserType> {
    const params = {
      UserPoolId: this.userPoolId,
      MessageAction: 'SUPPRESS',
      Username: user.email,
      UserAttributes: [
        {
          Name: 'name',
          Value: user.name
        },
        {
          Name: 'email',
          Value: user.email
        },
        {
          Name: 'email_verified',
          Value: 'true'
        }
      ]
    }
    const { User } = await this.cognito.adminCreateUser(params).promise()
    return User
  }

  async setPassword(email: string, password: string): Promise<void> {
    const params = {
      Password: password,
      UserPoolId: this.userPoolId,
      Username: email,
      Permanent: true
    }
    await this.cognito.adminSetUserPassword(params).promise()
  }

  async addUserToGroup(groupName: string, username: string): Promise<void> {
    const params = {
      GroupName: groupName,
      UserPoolId: this.userPoolId,
      Username: username
    }
    await this.cognito.adminAddUserToGroup(params).promise()
  }
}
