import { CognitoIdentityServiceProvider, Config } from 'aws-sdk';
require('dotenv').config();

const { AWS_REGION, ACCESS_TOKEN } = process.env;

/**
 * example JS code for signing a user out of all active sessions
 * @returns a cognito user session which includes the
 */
async function getUser(): Promise<CognitoIdentityServiceProvider.Types.GetUserResponse> {
  try {
    const result = await new Promise<CognitoIdentityServiceProvider.Types.GetUserResponse>((resolve, reject) => {
      const serviceProvider = new CognitoIdentityServiceProvider();
      serviceProvider.config = new Config({ region: AWS_REGION });
      const params: CognitoIdentityServiceProvider.Types.GetUserRequest = {
        AccessToken: ACCESS_TOKEN!
      };
      serviceProvider.getUser(params, (err, data) => {
        console.log('error is');
        console.log(err);
        console.log('data is');
        console.log(data);
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

getUser().then(console.log);
