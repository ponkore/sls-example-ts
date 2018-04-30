import AWS = require('aws-sdk');
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { readFileSync, existsSync } from 'fs';

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

const S3 = new AWS.S3({
  region: 'us-east-1',
});

const BUCKET_NAME = 'ponkore-bucket-001';

const createResponse = (status: string, message: string, data: any) => {
  let body = Object.assign({
    status: status,
    message: message
  }, data);
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(body)
  };
}

export const listFiles: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let folder = event.pathParameters['folder'];
  let param: AWS.S3.ListObjectsRequest = {
    Bucket: BUCKET_NAME,
    Prefix: folder + '/'
  };
  S3.listObjects(param).promise()
    .then(data => {
      if (data['Contents'] === undefined) {
        cb(null, createResponse('err', 'data[Contents] is undefined', {}));
        return;
      }
      let list = data['Contents'].map(d => ({ Key: d['Key'], LastModified: d['LastModified'] }));
      cb(null, createResponse('ok', '', { list: list }));
    })
    .catch(err => cb(null, createResponse('err', 's3.listObjects error', { error: err })));
}

export const readFile: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  cb(null, createResponse('ok', '', { data: {} }));
}

export const deleteFiles: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let folder = event.pathParameters['folder'];
  let filename = event.pathParameters['filename'];
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${filename}`,
  };
  S3.deleteObject(params).promise()
    .then(data => cb(null, createResponse('ok', '', { data: data })))
    .catch(err => cb(null, createResponse('err', 's3.deleteObject error', { error: err })));
}

export const addFile: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let folder = event.pathParameters['folder'];
  let filename = event.pathParameters['filename'];
  let body = event.body; // TODO: decode
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${filename}`,
    ContentType: 'application/octet-binary',
    Body: body
  };
  S3.putObject(params).promise()
    .then(data => cb(null, createResponse('ok', '', { data: data })))
    .catch(err => cb(null, createResponse('err', 's3.putObject error', { error: err })));
}
