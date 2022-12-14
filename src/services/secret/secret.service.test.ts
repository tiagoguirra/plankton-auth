import secretService from './secret.service'

describe('SecretService suit test', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return token from secret string value', async () => {
    expect.assertions(2)

    jest
      .spyOn(secretService.instance, 'getSecretValue')
      .mockImplementation(() => ({
        // @ts-expect-error
        promise: jest.fn(() =>
          Promise.resolve({ SecretString: '{"token": "sdasd4a54"}' })
        )
      }))

    const response = await secretService.getValue('secretId', true)
    expect(secretService.instance.getSecretValue).toBeCalledWith({
      SecretId: 'secretId'
    })

    expect(response).toStrictEqual({ token: 'sdasd4a54' })
  })

  it('should return token from secret string base64', async () => {
    expect.assertions(2)

    jest
      .spyOn(secretService.instance, 'getSecretValue')
      .mockImplementation(() => ({
        // @ts-expect-error
        promise: jest.fn(() =>
          Promise.resolve({
            SecretBinary: 'eyJ0b2tlbiI6ICJ0b2tlbkluQmFzZTY0In0='
          })
        )
      }))

    const response = await secretService.getValue('secretId', true)

    expect(response).toStrictEqual({ token: 'tokenInBase64' })
    expect(secretService.instance.getSecretValue).toBeCalledWith({
      SecretId: 'secretId'
    })
  })
})
