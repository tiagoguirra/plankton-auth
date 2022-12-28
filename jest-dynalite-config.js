module.exports = {
  tables: [
    {
      TableName: 'plankton-identity-staging',
      KeySchema: [{ AttributeName: 'identityId', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'identityId', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'providerName', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'userId-providerName-index',
          KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' },
            { AttributeName: 'providerName', KeyType: 'RANGE' }
          ],
          Projection: {
            ProjectionType: 'ALL'
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      ],
      data: [
        {
          identityId: 'Github-staging_1234345',
          userId: '1234345',
          providerName: 'Github-staging',
          credentials: {
            access_token: 'token',
            refresh_token: 'refresh',
            token_type: 'bearer',
            scope: 'user:email'
          },
          updatedAt: '2022-12-01T00:00:00.000Z',
          createdAt: '2022-12-01T00:00:00.000Z'
        }
      ]
    }
  ]
}
