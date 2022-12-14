export interface OpenIDTokenRequest {
  code: string
  state: string
  client_id: string
  client_secret: string
  grant_type: string
  redirect_uri: string
}

export interface OpenIDKeys {
  alg: string
  kid: string
  [key: string]: string
}

export interface OpenIDJwks {
  keys: OpenIDKeys[]
}
