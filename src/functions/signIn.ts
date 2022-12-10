import { APIGatewayEvent } from 'aws-lambda'
import { responseError, response } from '../factory/response'
import { SignInService } from '../services/signIn.service'
import { ApiGatewayResponse } from '../types/response'
import { SignIn } from '../types/signin'
import validation from '../validations/login'

export const handler = async (
  event: APIGatewayEvent
): Promise<ApiGatewayResponse> => {
  try {
    const body = JSON.parse(event.body)
    const value = await validation.validateAsync(body, { abortEarly: false })

    const signService = new SignInService()

    const authentication = await signService.emailAndPassword(value as SignIn)

    return response(authentication, 200)
  } catch (err) {
    return responseError(err, 'Failure to authenticate')
  }
}
