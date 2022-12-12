import { GithubUser } from '../types/github'
import { OAuthToken } from '../types/oauth'

export const mockGitHubAccessToken: OAuthToken = {
  access_token:
    'bcb21425-af70-423f-98b2-4663837b5b01bcb21425-af70-423f-98b2-4663837b5b01',
  scope: 'user,emails',
  token_type: 'bearer'
}

export const mockGitHubUser: GithubUser = {
  login: 'plankton',
  id: 343544354,
  node_id: 'maskdmaskda',
  avatar_url: 'https://avatars.githubusercontent.com/u/343544354?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/plankton',
  html_url: 'https://github.com/plankton',
  followers_url: 'https://api.github.com/users/plankton/followers',
  following_url: 'https://api.github.com/users/plankton/following{/other_user}',
  gists_url: 'https://api.github.com/users/plankton/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/plankton/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/plankton/subscriptions',
  organizations_url: 'https://api.github.com/users/plankton/orgs',
  repos_url: 'https://api.github.com/users/plankton/repos',
  events_url: 'https://api.github.com/users/plankton/events{/privacy}',
  received_events_url: 'https://api.github.com/users/plankton/received_events',
  type: 'User',
  site_admin: false,
  name: 'Plankton project',
  company: '@planktondoc ',
  blog: '',
  location: null,
  email: null,
  hireable: null,
  bio: 'Mock user for testing',
  twitter_username: null,
  public_repos: 17,
  public_gists: 0,
  followers: 13,
  following: 5,
  created_at: '2017-07-27T14:27:42Z',
  updated_at: '2022-12-09T00:00:42Z',
  private_gists: 0,
  total_private_repos: 0,
  owned_private_repos: 0,
  disk_usage: 7861,
  collaborators: 0,
  two_factor_authentication: true
}

export const mockGitHubUserEmails = [
  {
    email: 'mock@planktondoc.com',
    primary: true,
    verified: true,
    visibility: 'private'
  },
  {
    email: '343544354+planktondoc@users.noreply.github.com',
    primary: false,
    verified: true,
    visibility: null
  },
  {
    email: 'mocked@planktondoc.com',
    primary: false,
    verified: true,
    visibility: null
  }
]
