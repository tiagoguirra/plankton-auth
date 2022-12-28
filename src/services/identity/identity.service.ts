import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UserIdentity } from '../../types/identity'
import { OAuthToken } from '../../types/oauth'
import { DynamoDB } from '../aws'

class IdentityService {
  async update(
    providerName: string,
    providerUserId: string,
    credentials: OAuthToken
  ): Promise<UserIdentity> {
    const updatedAt = new Date().toISOString()
    const identityId = `${providerName}_${providerUserId}`
    const params: DocumentClient.UpdateItemInput = {
      TableName: process.env.TABLE_IDENTITY,
      Key: {
        identityId
      },
      UpdateExpression:
        'set #userId = :userId, #providerName = :providerName, #credentials = :credentials, #updatedAt = :updatedAt, #createdAt = if_not_exists(#createdAt, :updatedAt)',
      ExpressionAttributeNames: {
        '#userId': 'userId',
        '#providerName': 'providerName',
        '#credentials': 'credentials',
        '#updatedAt': 'updatedAt',
        '#createdAt': 'createdAt'
      },
      ExpressionAttributeValues: {
        ':userId': providerUserId,
        ':providerName': providerName,
        ':credentials': credentials,
        ':updatedAt': updatedAt
      },
      ReturnValues: 'ALL_NEW'
    }
    const { Attributes } = await DynamoDB.update(params).promise()
    return Attributes as UserIdentity
  }

  async getByProvider(
    providerName: string,
    providerUserId: string
  ): Promise<UserIdentity> {
    const identityId = `${providerName}_${providerUserId}`
    const params: DocumentClient.GetItemInput = {
      TableName: process.env.TABLE_IDENTITY,
      Key: {
        identityId
      }
    }
    const { Item } = await DynamoDB.get(params).promise()
    return Item as UserIdentity
  }
}

export default new IdentityService()
