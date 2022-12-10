import {
  CognitoException,
  ErrorAuthenticateException,
  NotFoundException
} from '../types/exceptions'
import { mockAuthentication } from '../mock/cognito.mock'
import { SignInService } from './signIn.service'

describe('SignInService suit test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return authentication success', async () => {
    expect.assertions(2)

    const signInService = new SignInService()
    // @ts-expect-error - mock cognito implementation
    jest.spyOn(signInService.cognito, 'initiateAuth').mockImplementation(() => {
      return {
        promise: () =>
          Promise.resolve({ AuthenticationResult: mockAuthentication })
      }
    })

    const authentication = await signInService.emailAndPassword({
      username: 'mock@planktondoc.com',
      password: 'mock@password'
    })

    expect(signInService.cognito.initiateAuth).toBeCalledWith({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.USER_CLIENT_ID,
      AuthParameters: {
        USERNAME: 'mock@planktondoc.com',
        PASSWORD: 'mock@password'
      }
    })

    expect(authentication).toEqual(mockAuthentication)
  })

  it('should return exception user not found', async () => {
    expect.assertions(1)

    const signInService = new SignInService()
    // @ts-expect-error - mock cognito implementation
    jest.spyOn(signInService.cognito, 'initiateAuth').mockImplementation(() => {
      return {
        promise: () =>
          Promise.reject(
            new CognitoException(
              'UserNotFoundException',
              'UserNotFoundException'
            )
          )
      }
    })

    await expect(
      signInService.emailAndPassword({
        username: 'mock@planktondoc.com',
        password: 'mock@password'
      })
    ).rejects.toThrow(new NotFoundException('signin.UserNotFound'))
  })

  it('should return exception user not authorized', async () => {
    expect.assertions(1)

    const signInService = new SignInService()
    // @ts-expect-error - mock cognito implementation
    jest.spyOn(signInService.cognito, 'initiateAuth').mockImplementation(() => {
      return {
        promise: () =>
          Promise.reject(
            new CognitoException(
              'NotAuthorizedException',
              'NotAuthorizedException'
            )
          )
      }
    })

    await expect(
      signInService.emailAndPassword({
        username: 'mock@planktondoc.com',
        password: 'mock@password'
      })
    ).rejects.toThrow(new ErrorAuthenticateException('signin.NotAuthorized'))
  })

  it('should return exception user not connfirmed', async () => {
    expect.assertions(1)

    const signInService = new SignInService()
    // @ts-expect-error - mock cognito implementation
    jest.spyOn(signInService.cognito, 'initiateAuth').mockImplementation(() => {
      return {
        promise: () =>
          Promise.reject(
            new CognitoException(
              'UserNotConfirmedException',
              'UserNotConfirmedException'
            )
          )
      }
    })

    await expect(
      signInService.emailAndPassword({
        username: 'mock@planktondoc.com',
        password: 'mock@password'
      })
    ).rejects.toThrow(new ErrorAuthenticateException('signin.UserNotConfirmed'))
  })

  it('should return error', async () => {
    expect.assertions(1)

    const signInService = new SignInService()
    // @ts-expect-error - mock cognito implementation
    jest.spyOn(signInService.cognito, 'initiateAuth').mockImplementation(() => {
      return {
        promise: () => Promise.reject(new Error('Unexpected error'))
      }
    })

    await expect(
      signInService.emailAndPassword({
        username: 'mock@planktondoc.com',
        password: 'mock@password'
      })
    ).rejects.toThrow(new Error('Unexpected error'))
  })
})
