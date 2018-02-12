import { AuthResponse, CustomAuthorizerEvent, CustomAuthorizerCallback, Context, CustomAuthorizerHandler } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';

// Set in `enviroment` of serverless.yml
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET

// Policy helper function
const generatePolicy = (principalId: string, effect: string, resource: string): AuthResponse => {
    const authResponse: AuthResponse = {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    };

    return authResponse
}
export const auth: CustomAuthorizerHandler = (event: CustomAuthorizerEvent, context: Context, callback: CustomAuthorizerCallback) => {
    console.log('event', event)
    if (!event.authorizationToken) {
        return callback(new Error('Unauthorized'));
    }

    const tokenParts = event.authorizationToken.split(' ')
    const tokenValue = tokenParts[1]

    if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
        // no auth token!
        return callback(new Error('Unauthorized'));
    }
    const options = {
        audience: AUTH0_CLIENT_ID,
    }
    // decode base64 secret. ref: http://bit.ly/2hA6CrO
    const secret = Buffer.from(AUTH0_CLIENT_SECRET, 'base64')
    try {
        jwt.verify(tokenValue, secret, options, (verifyError, decoded) => {
            if (verifyError) {
                console.log('verifyError', verifyError)
                // 401 Unauthorized
                console.log(`Token invalid. ${verifyError}`)
                return callback(new Error('Unauthorized'));
            }

            // is custom authorizer function
            console.log('valid from customAuthorizer', decoded)
            return callback(null, generatePolicy((decoded as any).sub, 'Allow', event.methodArn))
        })
    } catch (err) {
        console.log('catch error. Invalid token', err)
        return callback(new Error('Unauthorized'));
    }
}