import { mockPreSignUpTriggerEvent, mockUser } from '../../mock/cognito.mock'
import { CognitoTriggerService } from '../../services/cognito/cognito-trigger.service'
import { handler } from './preSignUp'

describe('CognitoService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should link users from extenral provider', async () => {
    expect.assertions(2)

    jest
      .spyOn(CognitoTriggerService.prototype, 'preSignUpExternalProvider')
      .mockResolvedValue(mockUser)

    const response = await handler(mockPreSignUpTriggerEvent)

    expect(
      CognitoTriggerService.prototype.preSignUpExternalProvider
    ).lastCalledWith({
      name: 'mock user',
      username: 'google_1234567890',
      email: 'mock@google.com'
    })
    expect(response).toEqual(mockPreSignUpTriggerEvent)
  })

  it('should do nothing if not external provider', async () => {
    expect.assertions(2)

    jest
      .spyOn(CognitoTriggerService.prototype, 'preSignUpExternalProvider')
      .mockResolvedValue(mockUser)

    const response = await handler({
      ...mockPreSignUpTriggerEvent,
      triggerSource: 'PreSignUp_SignUp'
    })

    expect(
      CognitoTriggerService.prototype.preSignUpExternalProvider
    ).not.toBeCalled()
    expect(response).toEqual({
      ...mockPreSignUpTriggerEvent,
      triggerSource: 'PreSignUp_SignUp'
    })
  })
})
