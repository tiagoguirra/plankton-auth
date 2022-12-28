import { CustomException } from '../types/exceptions'
import { ApiGatewayResponse } from '../types/response'
import { resolveException } from './exception'

const response = <T = any>(message: T, code: number): ApiGatewayResponse => {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(message, null, 2)
  }
}

const redirect = (url: string): ApiGatewayResponse => {
  return {
    statusCode: 302,
    headers: {
      Location: url
    }
  }
}

const responseError = (
  error: CustomException | unknown,
  defaultMessage: string
): ApiGatewayResponse => {
  const { errorCode, ...payload } = resolveException(error, defaultMessage)

  return response(payload, errorCode)
}

export default { response, redirect, responseError }
export { response, redirect, responseError }
