import AWS = require('aws-sdk');
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import handler = require('./handler');

const createEvent = ({ httpMethod, pathParameters, queryStringParameters, body }) => {
  return {
    body: body,
    headers: {},
    httpMethod: httpMethod,
    isBase64Encoded: false,
    path: '/',
    pathParameters: pathParameters,
    queryStringParameters: queryStringParameters,
    stageVariables: null,
    requestContext: {},
    resource: ''
  };
}

const createContext = ({ functionName }): Context => {
  let context: Context;
  // context.functionName = functionName;
  return context;
}

it('first test', () => {
  let event = createEvent({
    httpMethod: 'GET',
    pathParameters: {
      "folder": "masao27190"
    },
    queryStringParameters: null,
    body: null
  });
  let context = createContext({
    functionName: 'listFiles'
  });
  handler.listFiles(event, context, (err, data) => {
    expect(data['statusCode']).not.toBeUndefined();
    expect(data['headers']).not.toBeUndefined();
    expect(data['body']).not.toBeUndefined();
    expect(data['statusCode']).toBe(200);
    expect(data['headers']).toEqual({ "Access-Control-Allow-Origin": "*" });
    let body = JSON.parse(data['body']);
    expect(body).not.toBeNull();
    expect(body['status']).toBe('ok');
    expect(body['message']).toBe('');
    expect(body['list']).not.toBeUndefined();
  });
});
