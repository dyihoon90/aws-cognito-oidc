import jwt, { JwtPayload } from 'jsonwebtoken';
import jwks from 'jwks-rsa';
import { getUser } from './getUser';

export class Authorizer {
  constructor(private issuer: string, private jwksUri: string) {}

  public async authorize(token: string): Promise<jwt.JwtPayload | undefined> {
    const decoded: any = jwt.decode(token, { complete: true });
    const key = await this.getKey(decoded.header.kid);
    const verificationResult = await this.verify(token, key);
    if (verificationResult?.sub) {
      const user = await getUser(token);
      if (user.Username) {
        return verificationResult;
      }
    }
    return undefined;
  }

  private getKey(kid: any): Promise<string> {
    const client = jwks({
      jwksUri: this.jwksUri
    });

    return new Promise((resolve, reject) => {
      client.getSigningKey(kid, (err, key) => {
        if (err) {
          reject(err);
        }

        resolve(key.getPublicKey());
      });
    });
  }

  private verify(token: string, cert: string): Promise<JwtPayload | undefined> {
    const options = {
      issuer: this.issuer
    };

    return new Promise<JwtPayload | undefined>((resolve, reject) => {
      jwt.verify(token, cert, options, (err, decoded) => {
        if (err) {
          reject(err);
        }

        resolve(decoded);
      });
    });
  }
}
