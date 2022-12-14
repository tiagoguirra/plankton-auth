import { SecretsManager } from 'aws-sdk'

class SecretManagerService {
  readonly instance: SecretsManager

  constructor() {
    this.instance = new SecretsManager({ region: process.env.REGION })
  }

  parseValue<T = Object>(secret: string, toParser?: boolean): T {
    return toParser ? JSON.parse(secret) : secret
  }

  getValue<T = Object>(secretId: string, toParser?: boolean): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .getSecretValue({ SecretId: secretId })
        .promise()
        .then((data) => {
          if ('SecretString' in data) {
            resolve(this.parseValue<T>(data.SecretString, toParser))
          } else {
            const buff = Buffer.from(data.SecretBinary as string, 'base64')
            const value = buff.toString('ascii')

            resolve(this.parseValue<T>(value, toParser))
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default new SecretManagerService()
