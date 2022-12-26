import { PreSignUpTriggerEvent } from 'aws-lambda'
import { CognitoIdentityServiceProvider } from 'aws-sdk'

export const mockUser: CognitoIdentityServiceProvider.UserType = {
  Attributes: [
    {
      Name: 'sub',
      Value: '1234567890'
    },
    {
      Name: 'email_verified',
      Value: 'true'
    },
    {
      Name: 'email',
      Value: 'mock@user.com'
    }
  ],
  Username: '1234567890'
}

export const mockPreSignUpTriggerEvent: PreSignUpTriggerEvent = {
  version: '1',
  region: 'us-east-1',
  userPoolId: 'us-east-1_1234567890',
  triggerSource: 'PreSignUp_ExternalProvider',
  callerContext: {
    awsSdkVersion: 'aws-sdk-unknown-unknown',
    clientId: '1234567890'
  },
  userName: 'google_1234567890',
  request: {
    userAttributes: { email: 'mock@google.com', name: 'mock user' }
  },
  response: {
    autoConfirmUser: false,
    autoVerifyEmail: false,
    autoVerifyPhone: false
  }
}
