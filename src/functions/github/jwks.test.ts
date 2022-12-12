import { mockApiEvent } from '../../mock/api.mock'
import { GitHubService } from '../../services/github/github.service'
import { handler } from './jwks'

describe('Json web keys handler suit test', () => {
  it('should return keys', async () => {
    expect.assertions(2)
    jest.spyOn(GitHubService.prototype, 'getJwks').mockResolvedValue({
      keys: [
        {
          alg: 'RS256',
          kid: 'jwtRS256',
          certId: 'ce'
        }
      ]
    })
    const response = await handler(mockApiEvent)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      JSON.stringify(
        {
          keys: [
            {
              alg: 'RS256',
              kid: 'jwtRS256',
              certId: 'ce'
            }
          ]
        },
        null,
        2
      )
    )
  })

  it('should return error for exception', async () => {
    expect.assertions(2)
    jest
      .spyOn(GitHubService.prototype, 'getJwks')
      .mockRejectedValue(new Error('error'))

    const response = await handler(mockApiEvent)

    expect(response.statusCode).toEqual(500)
    expect(response.body).toEqual(
      JSON.stringify(
        {
          errorType: 'InternalFailure',
          errorMessage: 'error'
        },
        null,
        2
      )
    )
  })
})
