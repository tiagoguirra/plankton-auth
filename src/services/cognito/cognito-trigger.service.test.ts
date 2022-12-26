import { mockUser } from '../../mock/cognito.mock'
import { CognitoTriggerService } from './cognito-trigger.service'

describe('CognitoTriggerService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should link user to exists accounts', async () => {
    expect.assertions(2)

    const service = new CognitoTriggerService('userPoolId')
    jest.spyOn(service.cognito, 'listByEmail').mockResolvedValue([mockUser])
    jest.spyOn(service.cognito, 'linkUserAccounts').mockResolvedValue()

    await service.preSignUpExternalProvider({
      name: 'mock user',
      username: 'google_1234567890',
      email: 'mock@gmail.com'
    })

    expect(service.cognito.listByEmail).lastCalledWith('mock@gmail.com')
    expect(service.cognito.linkUserAccounts).lastCalledWith(
      'Google',
      '1234567890',
      mockUser.Username
    )
  })
  it('should create new user and link to external provider', async () => {
    expect.assertions(3)

    const service = new CognitoTriggerService('userPoolId')
    jest.spyOn(service.cognito, 'listByEmail').mockResolvedValue([])
    jest
      .spyOn(service.cognito, 'createUser')
      .mockResolvedValue({ ...mockUser, Username: 'mock@gmail.com' })
    jest.spyOn(service.cognito, 'setPassword').mockResolvedValue()
    jest.spyOn(service.cognito, 'linkUserAccounts').mockResolvedValue()
    jest.spyOn(service.cognito, 'addUserToGroup').mockResolvedValue()

    await service.preSignUpExternalProvider({
      name: 'mock user',
      username: 'google_1234567890',
      email: 'mock@gmail.com'
    })
    expect(service.cognito.createUser).lastCalledWith({
      name: 'mock user',
      email: 'mock@gmail.com'
    })
    expect(service.cognito.setPassword).lastCalledWith(
      'mock@gmail.com',
      expect.any(String)
    )
    expect(service.cognito.linkUserAccounts).lastCalledWith(
      'Google',
      '1234567890',
      'mock@gmail.com'
    )
  })
})
