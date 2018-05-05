import AWS = require('aws-sdk');
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { readFileSync, existsSync } from 'fs';
import handler = require('../handler');

const configureAWS = () => {
  const HOME = process.env['HOME'];
  const credentials = `${HOME}/.aws/credentials`;

  let ACCESS_KEY_ID = '';
  let SECRET_ACCESS_KEY = '';

  if (existsSync(credentials)) {
    let contents = readFileSync(credentials)
      .toString()
      .split('\n');
    for (let i = 0; i < contents.length; i++) {
      let s = contents[i];
      let re1 = new RegExp('^aws_access_key_id = ([A-Za-z0-9]+)').exec(s);
      if (re1) {
        ACCESS_KEY_ID = re1[1];
      }
      let re2 = new RegExp('^aws_secret_access_key = ([A-Za-z0-9]+)').exec(s);
      if (re2) {
        SECRET_ACCESS_KEY = re2[1];
      }
    }
  } else {
    ACCESS_KEY_ID = process.env['ACCESS_KEY_ID'];
    SECRET_ACCESS_KEY = process.env['SECRET_ACCESS_KEY'];
  }

  AWS.config.update({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
  });
}

configureAWS();

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
