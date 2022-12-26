import { mockUser } from '../../mock/cognito.mock'
import { CognitoService } from './cognito.service'

describe('CognitoService', () => {
  it('should list users by email', async () => {
    expect.assertions(2)
    const service = new CognitoService('userPoolId')

    jest.spyOn(service.cognito, 'listUsers').mockImplementation(() => ({
      promise: () =>
        // @ts-expect-error mock cognito user
        Promise.resolve({
          Users: [mockUser]
        })
    }))

    const users = await service.listByEmail('mock@user.com')

    expect(users).toEqual([mockUser])
    expect(service.cognito.listUsers).toHaveBeenCalledWith({
      UserPoolId: 'userPoolId',
      Filter: 'email = "mock@user.com"'
    })
  })
  it('should link user accounts', async () => {
    expect.assertions(1)

    const service = new CognitoService('userPoolId')
    jest
      .spyOn(service.cognito, 'adminLinkProviderForUser')
      .mockImplementation(() => ({
        // @ts-expect-error mock cognito link
        promise: () => Promise.resolve()
      }))

    await service.linkUserAccounts('1234567890', 'Google', 'user123')

    expect(service.cognito.adminLinkProviderForUser).toHaveBeenCalledWith({
      DestinationUser: {
        ProviderAttributeValue: 'user123',
        ProviderName: 'Cognito'
      },
      SourceUser: {
        ProviderAttributeName: 'Cognito_Subject',
        ProviderAttributeValue: '1234567890',
        ProviderName: 'Google'
      },
      UserPoolId: 'userPoolId'
    })
  })
  it('should create a user', async () => {
    expect.assertions(2)

    const service = new CognitoService('userPoolId')
    jest.spyOn(service.cognito, 'adminCreateUser').mockImplementation(() => ({
      promise: () =>
        // @ts-expect-error mock cognito user
        Promise.resolve({
          User: mockUser
        })
    }))

    const user = await service.createUser({
      email: 'mock@user.com',
      name: 'Mock'
    })
    expect(user).toEqual(mockUser)
    expect(service.cognito.adminCreateUser).toHaveBeenCalledWith({
      UserPoolId: 'userPoolId',
      MessageAction: 'SUPPRESS',
      Username: 'mock@user.com',
      UserAttributes: [
        {
          Name: 'name',
          Value: 'Mock'
        },
        {
          Name: 'email',
          Value: 'mock@user.com'
        },
        {
          Name: 'email_verified',
          Value: 'true'
        }
      ]
    })
  })
  it('should set random password', async () => {
    expect.assertions(1)

    const service = new CognitoService('userPoolId')
    jest
      .spyOn(service.cognito, 'adminSetUserPassword')
      .mockImplementation(() => ({
        // @ts-expect-error mock cognito change password
        promise: () => Promise.resolve()
      }))

    await service.setPassword('mock@user.com', '1234567890')
    expect(service.cognito.adminSetUserPassword).toHaveBeenCalledWith({
      Password: '1234567890',
      UserPoolId: 'userPoolId',
      Username: 'mock@user.com',
      Permanent: true
    })
  })
  it('should add user to group', async () => {
    expect.assertions(1)
    const service = new CognitoService('userPoolId')
    jest
      .spyOn(service.cognito, 'adminAddUserToGroup')
      .mockImplementation(() => ({
        // @ts-expect-error mock cognito add to group
        promise: () => Promise.resolve()
      }))

    await service.addUserToGroup('cognito', 'mock@user.com')
    expect(service.cognito.adminAddUserToGroup).toHaveBeenCalledWith({
      GroupName: 'cognito',
      UserPoolId: 'userPoolId',
      Username: 'mock@user.com'
    })
  })
})
