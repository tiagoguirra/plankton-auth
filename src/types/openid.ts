export interface OpenIDTokenRequest {
  code: string
  state: string
}

export interface OpenIDKeys {
  alg: string
  kid: string
  [key: string]: string
}

export interface OpenIDJwks {
  keys: OpenIDKeys[]
}
