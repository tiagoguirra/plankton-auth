import { response } from './response'

describe('HttpFactory suit test', () => {
  it('Response sucess', () => {
    expect.assertions(1)
    expect(
      response(
        {
          success: true,
          message: 'sucess'
        },
        200
      )
    ).toEqual(
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify(
          {
            success: true,
            message: 'sucess'
          },
          null,
          2
        )
      })
    )
  })

  it('Response errir', () => {
    expect.assertions(1)
    expect(
      response(
        {
          success: false,
          message: 'failure'
        },
        400
      )
    ).toEqual(
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: 'failure'
          },
          null,
          2
        )
      })
    )
  })
})
