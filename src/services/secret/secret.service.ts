import { SecretsManager } from 'aws-sdk'

export class SecretManagerService {
  readonly instance: SecretsManager

  constructor() {
    this.instance = new SecretsManager({ region: process.env.REGION })
  }

  getValue<T = { [key: string]: any }>(secretId: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .getSecretValue({ SecretId: secretId })
        .promise()
        .then((data) => {
          let secret = ''
          if ('SecretString' in data) {
            secret = data.SecretString
          } else {
            const buff = Buffer.from(data.SecretBinary as string, 'base64')
            secret = buff.toString('ascii')
          }
          resolve(JSON.parse(secret) as T)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
