import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { Config } from 'aws-sdk/lib/config';

const { REGION } = process.env;
export async function getUser(accessToken: string): Promise<CognitoIdentityServiceProvider.Types.GetUserResponse> {
  try {
    const result = await new Promise<CognitoIdentityServiceProvider.Types.GetUserResponse>((resolve, reject) => {
      const serviceProvider = new CognitoIdentityServiceProvider({ region: REGION! });
      const params: CognitoIdentityServiceProvider.Types.GetUserRequest = {
        AccessToken: accessToken
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
