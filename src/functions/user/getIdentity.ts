import { APIGatewayEvent } from 'aws-lambda'
import { responseError, response } from '../../factory/response'
import identityService from '../../services/identity/identity.service'
import { NotFoundException } from '../../types/exceptions'
import { UserIdentity } from '../../types/identity'
import { ApiGatewayResponse } from '../../types/response'
import { getAuthUser } from '../../utils/auth'

export const handler = async (
  event: APIGatewayEvent
): Promise<ApiGatewayResponse> => {
  try {
    const { provider } = event.pathParameters
    const user = getAuthUser(event)
    console.log(JSON.stringify(user, null, 2))
    const userIdentity = user.identities?.find(
      (i) => i.providerName === provider
    )
    if (!userIdentity) {
      throw new NotFoundException('user.identity_not_found')
    }
    const identity = await identityService.getByProvider(
      provider,
      userIdentity.userId
    )
    if (!identity) {
      throw new NotFoundException('user.identity_not_found')
    }

    return response<UserIdentity>(identity, 200)
  } catch (err) {
    console.error(err)
    return responseError(err, 'Failure to get user identity provider')
  }
}
