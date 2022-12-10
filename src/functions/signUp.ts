import { APIGatewayEvent } from 'aws-lambda'
import { responseError, response } from '../factory/response'
import { SignUpService } from '../services/signUp.service'
import { ApiGatewayResponse } from '../types/response'
import { SignUp } from '../types/signup'
import validation from '../validations/register'

export const handler = async (
  event: APIGatewayEvent
): Promise<ApiGatewayResponse> => {
  try {
    const body = JSON.parse(event.body)
    const value = await validation.validateAsync(body, { abortEarly: false })

    const signService = new SignUpService()

    await signService.byEmail(value as SignUp)

    return response({ message: 'User registred' }, 201)
  } catch (err) {
    return responseError(err, 'Failure to register user')
  }
}
