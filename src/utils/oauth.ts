const getIssue = (host: string, stage: string): string => {
  const lStage = stage
  const issuer = `${host}/${lStage}`
  return issuer
}

export { getIssue }
