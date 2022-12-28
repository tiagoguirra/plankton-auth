import * as AWS from 'aws-sdk'

if (
  (process.env.IS_LOCAL ||
    process.env.IS_OFFLINE ||
    process.env.SERVERLESS_TEST_ROOT ||
    process.env.NODE_ENV === 'test') &&
  process.env.CI !== 'true'
) {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: process.env.PROFILE
  })
}

const DynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_DEPLOY_REGION,
  ...(process.env.MOCK_DYNAMODB_ENDPOINT && {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: 'local'
  })
})

export { DynamoDB }
