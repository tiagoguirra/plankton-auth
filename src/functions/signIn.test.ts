import { mockApiEvent } from '../mock/api.mock'
import { mockAuthentication } from '../mock/cognito.mock'
import { SignInService } from '../services/signIn/signIn.service'
import { ErrorAuthenticateException } from '../types/exceptions'
import { handler } from './signIn'

describe('SignInService suit test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return authentication success', async () => {
    expect.assertions(3)
    jest
      .spyOn(SignInService.prototype, 'emailAndPassword')
      .mockResolvedValue(mockAuthentication)

    const response = await handler({
      ...mockApiEvent,
      body: JSON.stringify({
        username: 'mock@planktondoc.com',
        password: 'mock@password'
      })
    })

    expect(response.body).toEqual(JSON.stringify(mockAuthentication, null, 2))
    expect(response.statusCode).toEqual(200)
    expect(SignInService.prototype.emailAndPassword).toBeCalledWith({
      username: 'mock@planktondoc.com',
      password: 'mock@password'
    })
  })

  it('should return error for invalid body', async () => {
    jest
      .spyOn(SignInService.prototype, 'emailAndPassword')
      .mockResolvedValue(null)

    const response = await handler({
      ...mockApiEvent,
      body: JSON.stringify({})
    })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(
      JSON.stringify(
        {
          errorType: 'BadValidation',
          errorMessage: '- "username" is required\n- "password" is required\n'
        },
        null,
        2
      )
    )
  })

  it('should return error for exception', async () => {
    jest
      .spyOn(SignInService.prototype, 'emailAndPassword')
      .mockRejectedValue(new ErrorAuthenticateException('signin.NotAuthorized'))

    const response = await handler({
      ...mockApiEvent,
      body: JSON.stringify({
        username: 'mock@planktondoc.com',
        password: 'mock@password'
      })
    })

    expect(response.statusCode).toEqual(401)
    expect(response.body).toEqual(
      JSON.stringify(
        {
          errorType: 'AccessDenied',
          errorMessage: 'signin.NotAuthorized'
        },
        null,
        2
      )
    )
  })
})
