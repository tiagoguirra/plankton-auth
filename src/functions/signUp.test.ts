import { mockApiEvent } from '../mock/api.mock'
import { SignUpService } from '../services/signUp.service'
import { InvalidArgumentException } from '../types/exceptions'
import { handler } from './signUp'

describe('SignUpService suit test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return registration success', async () => {
    jest.spyOn(SignUpService.prototype, 'byEmail').mockResolvedValue()

    const response = await handler({
      ...mockApiEvent,
      body: JSON.stringify({
        email: 'mock@planktondoc.com',
        name: 'mock',
        password: 'mock@password',
        confirmPassword: 'mock@password'
      })
    })

    expect(response.body).toEqual(
      JSON.stringify({ message: 'User registred' }, null, 2)
    )
    expect(response.statusCode).toEqual(201)
  })

  it('should return error for invalid body', async () => {
    jest.spyOn(SignUpService.prototype, 'byEmail').mockResolvedValue()

    const response = await handler({
      ...mockApiEvent,
      body: JSON.stringify({
        email: 'mock@planktondoc.com',
        name: 'mock',
        password: 'mock@password',
        confirmPassword: 'mock@password2'
      })
    })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(
      JSON.stringify(
        {
          errorType: 'InvalidParameterValue',
          errorMessage: '- "Confirm password" does not match\n'
        },
        null,
        2
      )
    )
  })

  it('should return error for exception', async () => {
    jest
      .spyOn(SignUpService.prototype, 'byEmail')
      .mockRejectedValue(
        new InvalidArgumentException('signup.UserAlreadyExists')
      )

    const response = await handler({
      ...mockApiEvent,
      body: JSON.stringify({
        email: 'mock@planktondoc.com',
        name: 'mock',
        password: 'mock@password',
        confirmPassword: 'mock@password'
      })
    })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(
      JSON.stringify(
        {
          errorType: 'InvalidParameterValue',
          errorMessage: 'signup.UserAlreadyExists'
        },
        null,
        2
      )
    )
  })
})
