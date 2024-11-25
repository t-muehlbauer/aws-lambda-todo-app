import Axios from 'axios';
import { decode, verify } from 'jsonwebtoken';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('auth');
const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json';
let cachedCertificate;

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    };
  } catch (e) {
    logger.error('User not authorized', { error: e.message });

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    };
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader);
  const jwt = decode(token, { complete: true });

  if (!jwt) {
    throw new Error('Invalid token');
  }

  const kid = jwt.header.kid;
  const cert = await getCertificate(kid);

  return verify(token, cert, { algorithms: ['RS256'] });
}

function getToken(authHeader) {
  if (!authHeader) {
    throw new Error('No authentication header');
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authentication header');
  }

  const split = authHeader.split(' ');
  const token = split[1];

  return token;
}

async function getCertificate(kid) {
  if (cachedCertificate) return cachedCertificate;

  logger.info('Fetching certificate from Auth0');

  const response = await Axios.get(jwksUrl);
  const keys = response.data.keys;

  if (!keys || !keys.length) {
    throw new Error('The JWKS endpoint did not contain any keys');
  }

  const signingKeys = keys.filter(
    key =>
      key.use === 'sig' &&
      key.kty === 'RSA' &&
      key.alg === 'RS256' &&
      key.n &&
      key.e &&
      key.kid &&
      key.x5c &&
      key.x5c.length
  );

  if (!signingKeys.length) {
    throw new Error('The JWKS endpoint did not contain any signature verification keys');
  }

  const key = signingKeys.find(key => key.kid === kid);

  if (!key) {
    throw new Error(`Unable to find a signing key that matches '${kid}'`);
  }

  const pub = key.x5c[0];
  cachedCertificate = certToPEM(pub);

  logger.info('Valid certificate was downloaded', cachedCertificate);

  return cachedCertificate;
}

function certToPEM(cert) {
  return `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
}