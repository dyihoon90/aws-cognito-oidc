import 'babel-polyfill';
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserSession,
  CognitoRefreshToken,
  CognitoIdToken,
  CognitoAccessToken
} from 'amazon-cognito-identity-js';
require('dotenv').config();

const { USER_POOL_ID, CLIENT_ID, USERNAME, REFRESH_TOKEN, ID_TOKEN, ACCESS_TOKEN } = process.env;

/**
 * example JS code for signing a user out globally
 * Like all methods using the amazon-cognito-identity-js lib,
 * this is expected to run on the browser, but can also be run on a node env
 */
async function signoutGlobally(): Promise<string> {
  try {
    const cognitoUserPool = new CognitoUserPool({
      UserPoolId: USER_POOL_ID!,
      ClientId: CLIENT_ID!
    });
    const cognitoUser = new CognitoUser({
      Pool: cognitoUserPool,
      Username: USERNAME!
    });
    const refreshToken = new CognitoRefreshToken({
      RefreshToken: REFRESH_TOKEN!
    });
    const idToken = new CognitoIdToken({
      IdToken: ID_TOKEN!
    });
    const accessToken = new CognitoAccessToken({
      AccessToken: ACCESS_TOKEN!
    });
    const cognitoUserSession = new CognitoUserSession({
      RefreshToken: refreshToken,
      IdToken: idToken,
      AccessToken: accessToken
    });
    cognitoUser.setSignInUserSession(cognitoUserSession);

    const globalSignoutResult = await new Promise<string>((resolve, reject) => {
      cognitoUser.globalSignOut({
        onSuccess: resolve,
        onFailure: reject
      });
    });

    return globalSignoutResult;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

signoutGlobally().then(console.log);
