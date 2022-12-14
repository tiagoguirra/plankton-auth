import { APIGatewayEvent } from 'aws-lambda'
import { response, responseError } from '../../factory/response'
import githubService from '../../services/github/github.service'
import { ErrorAuthenticateException } from '../../types/exceptions'
import { ApiGatewayResponse } from '../../types/response'
import { parseToken } from '../../utils/parse'

export const handler = async (
  event: APIGatewayEvent
): Promise<ApiGatewayResponse> => {
  try {
    console.log(JSON.stringify(event, null, 2))
    const accessToken = parseToken(event)

    if (!accessToken) {
      throw new ErrorAuthenticateException('Access token is not found')
    }

    const userInfo = await githubService.userInfo(accessToken)

    return response(userInfo, 200)
  } catch (err) {
    console.error(err)

    return responseError(err, 'Failure to get user info')
  }
}
