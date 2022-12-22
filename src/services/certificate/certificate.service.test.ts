import { mockCertificateKey, mockCertificatePub } from '../../mock/secret.mock'
import certificateService from './certificate.service'
import fs from 'fs'
import path from 'path'

describe('CertificateService suit test', () => {
  it('should return public certificate', async () => {
    expect.assertions(2)

    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockCertificatePub)
    const response = await certificateService.public()

    expect(fs.readFileSync).toHaveBeenCalledWith(
      path.resolve(process.cwd(), process.env.GITHUB_CERT_PUBLIC),
      'utf8'
    )
    expect(response).toStrictEqual(mockCertificatePub)
  })

  it('should return private certificate', async () => {
    expect.assertions(2)

    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockCertificateKey)
    const response = await certificateService.key()

    expect(fs.readFileSync).toHaveBeenCalledWith(
      path.resolve(process.cwd(), process.env.GITHUB_CERT_KEY),
      'utf8'
    )
    expect(response).toStrictEqual(mockCertificateKey)
  })
})
