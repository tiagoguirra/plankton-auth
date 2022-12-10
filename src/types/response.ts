export interface ApiGatewayResponse {
  statusCode: number
  body?: string
  headers?: {
    [key: string]: string
  }
}

export interface ResponseError {
  errorType: string
  errorMessage: string
  errorCode: number
}
