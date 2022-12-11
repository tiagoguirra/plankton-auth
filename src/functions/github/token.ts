import { APIGatewayEvent } from 'aws-lambda'
import { response, responseError } from '../../factory/response'
import { GitHubService } from '../../services/github/github.service'
import { OpenIDTokenRequest } from '../../types/openid'
import { ApiGatewayResponse } from '../../types/response'
import { getIssue } from '../../utils/oauth'

export const handler = async (
  event: APIGatewayEvent
): Promise<ApiGatewayResponse> => {
  try {
    const { code, state }: OpenIDTokenRequest = JSON.parse(event.body)
    const issuer = getIssue(event.headers.Host, event.requestContext?.stage)

    const github = new GitHubService()

    const accessToken = await github.accessToken(code, state, issuer)

    return response(accessToken, 200)
  } catch (err) {
    console.error(err)
    return responseError(err, 'Failure to get access token')
  }
}
