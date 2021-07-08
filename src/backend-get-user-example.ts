import { CognitoIdentityServiceProvider, Config } from 'aws-sdk';
require('dotenv').config();

const { AWS_REGION, ACCESS_TOKEN } = process.env;

/**
 * example JS code for getting a user's info.
 * @returns user data similar to that in the ID token
 * this is exected to be run on a backend server in a node env
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
