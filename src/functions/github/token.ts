import { APIGatewayEvent } from 'aws-lambda'
import { response, responseError } from '../../factory/response'
import githubService from '../../services/github/github.service'
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

    const client: OpenIDTokenRequest = {
      code: body?.code || query?.code,
      state: body?.state || query?.state,
      client_id: body?.client_id || query?.client_id,
      client_secret: body?.client_secret || query?.client_secret,
      grant_type: body?.grant_type || query?.grant_type,
      redirect_uri: body?.redirect_uri || query?.redirect_uri
    }

    const issuer = getIssue(event.headers.Host, event.requestContext?.stage)

    const accessToken = await githubService.accessToken(client, issuer)

    return response(accessToken, 200)
  } catch (err) {
    console.error(err)
    return responseError(err, 'Failure to get access token')
  }
}
