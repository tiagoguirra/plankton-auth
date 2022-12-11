import { APIGatewayEvent } from 'aws-lambda'
import { redirect } from '../../factory/response'
import { ApiGatewayResponse } from '../../types/response'

export const handler = async (event: APIGatewayEvent): Promise<ApiGatewayResponse> => {
  const {
    client_id: clientId,
    scope,
    state,
    response_type: responseType
  } = event.queryStringParameters

  const _scope = encodeURIComponent(scope)
  const redirectUrl = `${process.env.GITHUB_LOGIN_URL}/login/oauth/authorize?client_id=${clientId}&scope=${_scope}&state=${state}&response_type=${responseType}`

  return redirect(redirectUrl)
}
