import { APIGatewayEvent } from 'aws-lambda'
import { response, responseError } from '../../factory/response'
import { GitHubService } from '../../services/github/github.service'
import { ApiGatewayResponse } from '../../types/response'

export const handler = async (
  event: APIGatewayEvent
): Promise<ApiGatewayResponse> => {
  try {
    console.log(JSON.stringify(event, null, 2))
    const github = new GitHubService()

    const jwks = await github.getJwks()

    return response(jwks, 200)
  } catch (err) {
    console.error(err)
    return responseError(err, 'Failure to get json web keys')
  }
}
