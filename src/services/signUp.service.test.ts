import { CognitoException, InvalidArgumentException } from '../types/exceptions'
import { SignUpService } from './signUp.service'

describe('SignUpService suit test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should register user', async () => {
    expect.assertions(1)
    const signUpService = new SignUpService()
    jest
      .spyOn(signUpService.cognito, 'signUp')
      // @ts-expect-error - mock cognito implementation
      .mockImplementation(() => {
        return {
          promise: () => Promise.resolve()
        }
      })

    await signUpService.byEmail({
      email: 'mock@planktondoc.com',
      name: 'mock user',
      password: 'mock@password'
    })

    expect(signUpService.cognito.signUp).toBeCalledWith({
      Username: 'mock@planktondoc.com',
      Password: 'mock@password',
      ClientId: process.env.USER_CLIENT_ID,
      UserAttributes: [
        {
          Name: 'email',
          Value: 'mock@planktondoc.com'
        },
        {
          Name: 'name',
          Value: 'mock user'
        }
      ]
    })
  })

  it('should return error when user already exists', async () => {
    expect.assertions(1)

    const signUpService = new SignUpService()
    jest
      .spyOn(signUpService.cognito, 'signUp')
      // @ts-expect-error - mock cognito implementation
      .mockImplementation(() => {
        return {
          promise: () =>
            Promise.reject(
              new CognitoException(
                'UsernameExistsException',
                'UsernameExistsException'
              )
            )
        }
      })

    await expect(
      signUpService.byEmail({
        email: 'mock@planktondoc.com',
        name: 'mock user',
        password: 'mock@password'
      })
    ).rejects.toThrow(new InvalidArgumentException('signup.UserAlreadyExists'))
  })

  it('should return error', async () => {
    expect.assertions(1)

    const signUpService = new SignUpService()

    jest
      .spyOn(signUpService.cognito, 'signUp')
      // @ts-expect-error - mock cognito implementation
      .mockImplementation(() => {
        return {
          promise: () => Promise.reject(new Error('Unexpected error'))
        }
      })

    await expect(
      signUpService.byEmail({
        email: 'mock@planktondoc.com',
        name: 'mock user',
        password: 'mock@password'
      })
    ).rejects.toThrow(new Error('Unexpected error'))
  })
})
