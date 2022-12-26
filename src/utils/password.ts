export const generatePassword = (): string => {
  return `${Math.random().toString(36).slice(-8)}42`
}
