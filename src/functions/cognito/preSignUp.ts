import { PreSignUpTriggerEvent } from 'aws-lambda'
import { CognitoTriggerService } from '../../services/cognito/cognito-trigger.service'

const EXTERNAL_AUTHENTICATION_PROVIDER = 'PreSignUp_ExternalProvider'

export const handler = async (
  event: PreSignUpTriggerEvent
): Promise<PreSignUpTriggerEvent> => {
  console.log(JSON.stringify(event, null, 2))
  try {
    const {
      triggerSource,
      userPoolId,
      userName,
      request: {
        userAttributes: { email, name }
      }
    } = event

    if (triggerSource === EXTERNAL_AUTHENTICATION_PROVIDER) {
      const cognitoService = new CognitoTriggerService(userPoolId)

      const user = await cognitoService.preSignUpExternalProvider({
        name,
        username: userName,
        email
      })
      // If created user, auto verify email and auto confirm user
      if (user) {
        event.response.autoVerifyEmail = true
        event.response.autoConfirmUser = true
      }
    }
    return event
  } catch (err) {
    console.log(err)
    throw err
  }
}
