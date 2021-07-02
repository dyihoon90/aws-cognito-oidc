# Cognito OIDC understanding

This repo is to share the findings on Cognito APIs and Cognito Authorizer on the API Gateway

## Main Findings:

### Q: Can we use Cognito to help us achieve the strict requirement for only one active session at one time?

\
A: Yes, but not with default Cognito settings.

\
During the login process, we add a hook to the `Pre Token Generation` event in Cognito. The event provides the user pool and username.

\
Using the user pool and username, we call `adminUserGlobalSignOut`, and remove all current active refresh tokens before returning tokens

\
During the API authorization process,instead of using the default Cognito Authorizer to protect our resource APIs on API Gateway, we need to use our own custom authorizer.

\
The custom authorizer will call Cognito's `getUser` API, which will return `401` if the refresh token that generated the access token had been revoked due to the global signout.

### Q: Can we use Cognito if we need to revoke a user's access if they are abusing our APIs?

\
A: Yes. We can sign the user out globally, or even remove the user from the user pool.

\
But similar to the question above, on the authorizer side we will need our own custom authorizer if we want the restrictions to take effect immediately.

\
If immediate restriction is not required, we can use the default Cognito authorizer with access/ID tokens that are sufficiently short-lived (<3 mins)

\
After 3 minutes is up, those access token will fail too, and the user cannot get new access tokens as all refresh tokens have been revoked.

# APIs spike

The APIs below can be tested in this repo.

This is assuming you have already set up the user pool in Cognito and set up a flow to get the tokens.

- Refresh token can only be gotten from the Authorization code grant flow.

- Implicit grant flow only returns access token and ID token.

- Client credentials flow only return access token.

Steps:

1. `npm i`
2. `cp .env.example .env`
3. fill in the relevant env variables in the .env
4. run the scripts in the package.json e.g. `npm run getuser`

## refreshing session

call `refreshSession`

- pass in refresh token
- refresh session will get back new access token
- most things are the same except `jti` `exp` and `iat`
- `origin-jti` (the refresh token’s jti) remains the same definitely
- fails with `401` after `revokeToken` or `adminUserGlobalSignOut`

## get user

call `getUser`

- pass in access token
- access token needs certain scope, probably the `profile` scope
- returns user attributes
- fails with `401` after `revokeToken` or `adminUserGlobalSignOut`

## revoking token

call `revokeToken`

- pass in the refresh token to be revoked

- cannot refresh sessions w that refresh token anymore

- using previously issued access token, still can call protected APIs
  with Cognito authorizer

## single session only

call `adminUserGlobalSignOut`

- pass in the username and user pool id

- cannot refresh sessions w previously issued refresh token anymore

- using previously issued access token, still can call protected APIs
  with Cognito authorizer

## single session only

call `adminUserGlobalSignOut`

- pass in the username and user pool id

- cannot refresh sessions w previously issued refresh token anymore

- using previously issued access token, still can call protected APIs
  with Cognito authorizer

---

## API Gateway Cognito Authorizer

### Does a protected API require ID token or access token?

\
Depending on the scope defined in the API, require different tokens.

\
if OAuth Scopes set to NONE

- using access token gives 401 unauthorized.
- ID token can access the API

\
if OAuth Scopes set to anything e.g. `my-app/get` or `profile`

- using access token can access the API
- ID token gives 401 unauthorized.

### When a refresh token is revoked, will we still be authorized to acces the API?

\
Yes. after calling `revokeToken` or `adminUserGlobalSignOut`, the Cognito authorizer will still allow requests with access/ID token of revoked refresh token.

\
This is probably because the authorizer only validates the JWT itself and does not confirm its revocation status with the Cognito server.

\
Confirming with Cognito server is a round-trip for each protected API invocation, increases latency of API responses.

### How can we create an Authorizer that will respect the revoked refresh token?

\
One possible way is to create a custom authorizer that calls the `getUser`, which will let us know whether the access token has been revoked.
