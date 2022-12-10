import { APIGatewayEvent } from 'aws-lambda'

export const mockApiEvent: APIGatewayEvent = {
  queryStringParameters: null,
  pathParameters: null,
  body: null,
  headers: null,
  multiValueHeaders: null,
  httpMethod: null,
  isBase64Encoded: false,
  path: null,
  requestContext: null,
  resource: null,
  multiValueQueryStringParameters: null,
  stageVariables: null
}
