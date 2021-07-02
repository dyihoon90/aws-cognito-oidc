import AWS, { CognitoIdentityServiceProvider, Config, Endpoint } from 'aws-sdk';
require('dotenv').config();
type RevokeTokenResponse = CognitoIdentityServiceProvider.Types.RevokeTokenResponse;
const { AWS_REGION, CLIENT_ID, REFRESH_TOKEN, COGNITO_SERVICE_ENDPOINT } = process.env;

// TODO: DY: Have not got the SDK to work yet. Able to call via AWS' revoke endpoint
// https://docs.aws.amazon.com/cognito/latest/developerguide/revocation-endpoint.html
/**
 * This is the example for revoking a refresh token. It is currently not working
 * Not enough docs from AWS to figure out why
 * Can revoke successfully with the revoke token HTTP endpoint
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
