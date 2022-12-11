import { ValidationError } from 'joi'
import {
  AlreadyExistException,
  CustomException,
  ErrorAuthenticateException,
  InvalidArgumentException,
  NotFoundException
} from '../types/exceptions'
import { ResponseError } from '../types/response'

const BadRequest = (
  error: InvalidArgumentException,
  message: string
): ResponseError => {
  return {
    errorCode: 400,
    errorType: 'BadRequest',
    errorMessage: error.message || message
  }
}

const Conflict = (
  error: AlreadyExistException,
  message: string
): ResponseError => {
  return {
    errorCode: 409,
    errorType: 'Conflict',
    errorMessage: error.message || message
  }
}

const NotFound = (error: NotFoundException, message: string): ResponseError => {
  return {
    errorCode: 404,
    errorType: 'NotFound',
    errorMessage: error.message || message
  }
}

const Unauthorized = (
  error: ErrorAuthenticateException,
  message
): ResponseError => {
  return {
    errorCode: 401,
    errorType: 'AccessDenied',
    errorMessage: error.message || message
  }
}

const BadValidation = (
  error: ValidationError,
  message: string
): ResponseError => {
  const details = error.details
  const detailsMessage = details.reduce(
    (message, detail) => `${message}- ${detail.message}\n`,
    ''
  )
  return {
    errorCode: 400,
    errorType: 'BadValidation',
    errorMessage: detailsMessage || message
  }
}

const ServerError = (error: Error, message: string): ResponseError => {
  return {
    errorCode: 500,
    errorType: 'InternalFailure',
    errorMessage:
      error?.message || `${message}, read the application log for more details`
  }
}

const resolveException = (
  error: CustomException | unknown,
  message: string
): ResponseError => {
  switch (error.constructor) {
    case InvalidArgumentException:
      return BadRequest(error as InvalidArgumentException, message)
    case AlreadyExistException:
      return Conflict(error as AlreadyExistException, message)
    case NotFoundException:
      return NotFound(error as NotFoundException, message)
    case ErrorAuthenticateException:
      return Unauthorized(error as ErrorAuthenticateException, message)

    default: {
      if ((error as ValidationError)?.isJoi) {
        return BadValidation(error as ValidationError, message)
      }
      return ServerError(error as Error, message)
    }
  }
}

export {
  resolveException,
  BadValidation,
  Conflict,
  NotFound,
  Unauthorized,
  BadRequest,
  ServerError
}
