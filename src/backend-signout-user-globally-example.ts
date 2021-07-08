import { CognitoIdentityServiceProvider, Config } from 'aws-sdk';
require('dotenv').config();

const { AWS_REGION, USER_POOL_ID, USERNAME } = process.env;

/**
 * example JS code for signing a user out of all active sessions
 * This is expected to be run in a backend server in a node environment
 */
async function signUserOut(): Promise<CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutResponse> {
  try {
    const result = await new Promise<CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutResponse>(
      (resolve, reject) => {
        const serviceProvider = new CognitoIdentityServiceProvider();
        serviceProvider.config = new Config({ region: AWS_REGION });
        const params: CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutRequest = {
          Username: USERNAME!,
          UserPoolId: USER_POOL_ID!
        };
        serviceProvider.adminUserGlobalSignOut(params, (err, data) => {
          console.log('error is');
          console.log(err);
          console.log('data is');
          console.log(data);
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      }
    );
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

signUserOut().then(console.log);
