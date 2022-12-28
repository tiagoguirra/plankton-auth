import { isDevelopmentEnv, isTestEnv } from './testFunctions'

describe('TestFunctions suit test', () => {
  it('test isDevelopmentEnv', () => {
    expect.assertions(1)
    process.env.NODE_ENV = undefined

    expect(isDevelopmentEnv()).toEqual(false)
  })

  it('test isTestEnv', () => {
    expect.assertions(1)

    expect(isTestEnv()).toEqual(true)
  })
})
