import { APIGatewayEvent } from 'aws-lambda'
import qs from 'querystring'

const parseBody = <T = Object>(event: APIGatewayEvent): T => {
  const contentType = event.headers['Content-Type'] || ''
  if (event.body) {
    if (contentType.startsWith('application/x-www-form-urlencoded')) {
      return qs.parse(event.body) as T
    }
    if (contentType.startsWith('application/json')) {
      return JSON.parse(event.body)
    }
  }
  return null
}

const parseToken = ({
  headers,
  queryStringParameters,
  body
}: APIGatewayEvent): string => {
  const authorization = headers.Authorization

  if (authorization) {
    const [, token] = authorization.split(' ')

    return token
  }

  const queryToken = queryStringParameters.access_token

  if (queryToken) {
    return queryToken
  }

  if (headers['Content-Type'] === 'application/x-www-form-urlencoded' && body) {
    const { access_token: accessToken } = qs.parse(body)

    return accessToken as string
  }

  return null
}

export { parseBody, parseToken }
