import { APIGatewayEvent } from 'aws-lambda'
import { response, responseError } from '../../factory/response'
import { GitHubService } from '../../services/github/github.service'
import { OpenIDTokenRequest } from '../../types/openid'
import { ApiGatewayResponse } from '../../types/response'
import { getIssue } from '../../utils/oauth'
import { parseBody } from '../../utils/parse'

export const handler = async (
  event: APIGatewayEvent
): Promise<ApiGatewayResponse> => {
  try {
    console.log(JSON.stringify(event, null, 2))

    const body = parseBody<OpenIDTokenRequest>(event)
    const query = event.queryStringParameters || {}

    const code = body.code || query.code
    const state = body.state || query.state

    const issuer = getIssue(event.headers.Host, event.requestContext?.stage)

    const github = new GitHubService()

    const accessToken = await github.accessToken(code, state, issuer)

    return response(accessToken, 200)
  } catch (err) {
    console.error(err)
    return responseError(err, 'Failure to get access token')
  }
}
