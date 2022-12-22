import fs from 'fs'
import path from 'path'

class CertificateService {
  async public(): Promise<string> {
    return fs.readFileSync(
      path.resolve(process.cwd(), process.env.GITHUB_CERT_PUBLIC),
      'utf8'
    )
  }

  async key(): Promise<string> {
    return fs.readFileSync(
      path.resolve(process.cwd(), process.env.GITHUB_CERT_KEY),
      'utf8'
    )
  }
}

export default new CertificateService()
