import { mockCertificateKey, mockCertificatePub } from '../../mock/secret.mock'
import secretService from '../secret/secret.service'
import certificateService from './certificate.service'

describe('CertificateService suit test', () => {
  it('should return public certificate', async () => {
    expect.assertions(2)

    jest.spyOn(secretService, 'getValue').mockResolvedValue(mockCertificatePub)
    const response = await certificateService.public()

    expect(secretService.getValue).toHaveBeenCalledWith(
      process.env.SECRET_CERT_PUB
    )
    expect(response).toStrictEqual(mockCertificatePub)
  })

  it('should return private certificate', async () => {
    expect.assertions(2)

    jest.spyOn(secretService, 'getValue').mockResolvedValue(mockCertificateKey)
    const response = await certificateService.key()

    expect(secretService.getValue).toHaveBeenCalledWith(
      process.env.SECRET_CERT_KEY
    )
    expect(response).toStrictEqual(mockCertificateKey)
  })
})
