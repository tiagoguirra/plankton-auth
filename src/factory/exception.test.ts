import {
  AlreadyExistException,
  ErrorAuthenticateException,
  InvalidArgumentException,
  NotFoundException
} from '../types/exceptions'
import { resolveException } from './exception'
import { responseError } from './response'

describe('ErrorException suit test', () => {
  it('BadRequest', () => {
    expect.assertions(1)

    expect(
      resolveException(new InvalidArgumentException('invalid'), 'invalid')
    ).toEqual({
      errorCode: 400,
      errorType: 'BadRequest',
      errorMessage: 'invalid'
    })
  })

  it('AlreadyExistException', () => {
    expect.assertions(1)

    expect(
      resolveException(new AlreadyExistException('invalid'), 'invalid')
    ).toEqual({
      errorCode: 409,
      errorType: 'Conflict',
      errorMessage: 'invalid'
    })
  })

  it('NotFoundException', () => {
    expect.assertions(1)

    expect(
      resolveException(new NotFoundException('invalid'), 'invalid')
    ).toEqual({
      errorCode: 404,
      errorType: 'NotFound',
      errorMessage: 'invalid'
    })
  })

  it('ErrorAuthenticateException', () => {
    expect.assertions(1)

    expect(
      resolveException(new ErrorAuthenticateException('invalid'), 'invalid')
    ).toEqual({
      errorCode: 401,
      errorType: 'AccessDenied',
      errorMessage: 'invalid'
    })
  })

  it('InternalFailure', () => {
    expect.assertions(1)

    expect(resolveException(new Error('invalid'), 'invalid')).toEqual({
      errorCode: 500,
      errorType: 'InternalFailure',
      errorMessage: 'invalid'
    })
  })

  it('responseError', () => {
    expect.assertions(1)

    expect(
      responseError(new InvalidArgumentException('invalid'), 'invalid')
    ).toEqual(
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify(
          {
            errorType: 'BadRequest',
            errorMessage: 'invalid'
          },
          null,
          2
        )
      })
    )
  })
})
