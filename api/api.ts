import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const hello: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    headers: {
      /* Required for CORS support to work */
      "Access-Control-Allow-Origin": "*",
      /* Required for cookies, authorization headers with HTTPS */
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  cb(null, response);
}

export const post: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    headers: {
      /* Required for CORS support to work */
      "Access-Control-Allow-Origin": "*",
      /* Required for cookies, authorization headers with HTTPS */
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      message: 'Private Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  cb(null, response);
}