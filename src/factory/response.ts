import { CustomException } from '../types/exceptions'
import { ApiGatewayResponse } from '../types/response'
import { resolveException } from './exception'

const response = (message: any, code: number): ApiGatewayResponse => {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(message, null, 2)
  }
}

const responseError = (
  error: CustomException | unknown,
  defaultMessage: string
): ApiGatewayResponse => {
  const { errorCode, ...payload } = resolveException(error, defaultMessage)

  return response(payload, errorCode)
}

export default { response, responseError }
export { response, responseError }
