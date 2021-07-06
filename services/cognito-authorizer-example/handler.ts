import { Authorizer } from './src/authorizer';
import { AWSPolicyGenerator } from './src/aws-policy-generator';

const { JWKS_URI, TOKEN_ISSUER } = process.env;

export const authorize = async (event: IAuthorizationEvent, context, cb) => {
  try {
    console.log(JSON.stringify(event));
    const accessToken = event.headers.Authorization || event.headers.authorization;
    const client = new Authorizer(TOKEN_ISSUER!, JWKS_URI!);
    const result = await client.authorize(accessToken);
    if (result && result.sub) {
      return AWSPolicyGenerator.generate(result.sub, 'Allow', event.methodArn);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

interface IAuthorizationEvent {
  type: string;
  methodArn: string;
  resource: string;
  path: string;
  httpMethod: string;
  headers: {
    Accept: string;
    'Accept-Encoding': string;
    Host: string;
    'Postman-Token': string;
    'User-Agent': string;
    'X-Amzn-Trace-Id': string;
    'x-api-key'?: string;
    'X-Forwarded-For': string;
    'X-Forwarded-Port': string;
    'X-Forwarded-Proto': string;
    Authorization: string;
    authorization: string;
    Identity: string;
    identity: string;
  };
  multiValueHeaders: {
    Accept: string[];
    'Accept-Encoding': string[];
    Host: string[];
    'Postman-Token': string[];
    'User-Agent': string[];
    'X-Amzn-Trace-Id': string[];
    'x-api-key'?: string[];
    'X-Forwarded-For': string[];
    'X-Forwarded-Port': string[];
    'X-Forwarded-Proto': string[];
    Authorization: string[];
    Identity: string[];
  };
  queryStringParameters: {
    sd: string;
    multiValueQueryStringParameters: { sd: string[] };
    pathParameters: {};
    stageVariables: {};
    requestContext: {
      resourceId: string;
      resourcePath: string;
      httpMethod: string;
      extendedRequestId: string;
      requestTime: string;
      path: string;
      accountId: string;
      protocol: string;
      stage: string;
      domainPrefix: string;
      requestTimeEpoch: number;
      requestId: string;
      identity: {
        cognitoIdentityPoolId: null;
        cognitoIdentityId: null;
        apiKey: string;
        principalOrgId: null;
        cognitoAuthenticationType: null;
        userArn: null;
        apiKeyId: string;
        userAgent: string;
        accountId: null;
        caller: null;
        sourceIp: string;
        accessKey: null;
        cognitoAuthenticationProvider: null;
        user: null;
      };
      domainName: string;
      apiId: string;
    };
  };
}
