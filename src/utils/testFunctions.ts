export function isDevelopmentEnv(): boolean {
  const isLocal =
    process.env.IS_LOCAL ||
    process.env.IS_OFFLINE ||
    process.env.SERVERLESS_TEST_ROOT ||
    process.env.NODE_ENV === 'test'
  return !!isLocal && process.env.CI !== 'true'
}

export const isTestEnv = (): boolean => {
  return !!process.env.JEST_WORKER_ID
}
