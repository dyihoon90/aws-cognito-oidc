import { CognitoIdentityServiceProvider, Config } from 'aws-sdk';
require('dotenv').config();
type RevokeTokenResponse = CognitoIdentityServiceProvider.Types.RevokeTokenResponse;
const { AWS_REGION, CLIENT_ID, REFRESH_TOKEN } = process.env;

/**
 * This is the example for revoking a refresh token.
 * This is expected to be run in a backend server and not the browser
 * @returns revoke response
 */
async function main() {
  try {
    const results = await new Promise<RevokeTokenResponse>((resolve, reject) => {
      const serviceProvider = new CognitoIdentityServiceProvider();
      serviceProvider.config = new Config({ region: AWS_REGION });
      const params: CognitoIdentityServiceProvider.Types.RevokeTokenRequest = {
        Token: REFRESH_TOKEN!,
        ClientId: CLIENT_ID!
      };
      serviceProvider.revokeToken(params, (err, data) => {
        console.log('error is');
        console.log(err);
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
    return results;
  } catch (e) {
    console.log(e);
  }
}

main().then(console.log);
