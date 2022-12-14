import secretService from '../secret/secret.service'

class CertificateService {
  async public(): Promise<string> {
    return secretService.getValue(process.env.SECRET_CERT_PUB)
  }

  async key(): Promise<string> {
    return secretService.getValue(process.env.SECRET_CERT_KEY)
  }
}

export default new CertificateService()
