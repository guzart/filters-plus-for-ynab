interface BuildAuthorizationUrlProps {
  clientId: string
  redirectUrl: string
}

export function buildAuthorizationUrl({ clientId, redirectUrl }: BuildAuthorizationUrlProps) {
  return `https://app.ynab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=token`
}
