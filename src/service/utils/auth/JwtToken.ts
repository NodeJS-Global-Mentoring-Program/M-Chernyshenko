import jwt from 'jsonwebtoken';

interface SignData {
  uuid: string;
  [x: string]: any;
}

const jwtSecret = 'secret_passphrase';

const tokens: string[] = [];

export class JwtToken {
  private secret;

  public constructor(secret: jwt.Secret = jwtSecret) {
    this.secret = secret;
  }

  public sign(data: SignData): string {
    const token = jwt.sign(data, this.secret);
    tokens.push(token);
    return token;
  }

  public verify(token: string): SignData {
    const decoder = jwt.verify(token, this.secret);
    if (typeof decoder === 'string') {
      throw new Error('Wrong token format');
    }

    return decoder as SignData;
  }
}
