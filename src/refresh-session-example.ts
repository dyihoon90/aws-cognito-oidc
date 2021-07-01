import { CognitoUserPool, CognitoRefreshToken, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
require('dotenv').config();

const { USER_POOL_ID, CLIENT_ID, USERNAME, REFRESH_TOKEN } = process.env;

/**
 * example JS code for refreshing a user's session
 * @returns a cognito user session which includes the
 */
async function refreshSession(): Promise<CognitoUserSession> {
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

    const userSession = await new Promise<CognitoUserSession>((resolve, reject) => {
      try {
        cognitoUser.refreshSession(refreshToken, (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        });
      } catch (e) {
        reject(e);
      }
    });
    return userSession;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

refreshSession().then(console.log);
