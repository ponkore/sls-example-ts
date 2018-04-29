import AWS = require('aws-sdk');
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: ''
});
let s3 = new AWS.S3({
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

export const listFiles: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let folder = event.pathParameters['folder'];
  let param: AWS.S3.ListObjectsRequest = {
    Bucket: BUCKET_NAME,
    Prefix: folder + '/'
  };
  let data = await s3.listObjects(param).promise()
    .catch(err => {
      cb(null, createResponse('err', 's3.listObjects error', { error: err }));
      throw (err);
    });
  if (data['Contents'] === undefined) {
    cb(null, createResponse('err', 'data[Contents] is undefined', {}));
    return;
  }
  let list = data['Contents'].map(d => ({ Key: d['Key'], LastModified: d['LastModified'] }));
  cb(null, createResponse('ok', '', { list: list }));
}

export const readFile: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  cb(null, createResponse('ok', '', { data: {} }));
}

export const deleteFiles: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let folder = event.pathParameters['folder'];
  let filename = event.pathParameters['filename'];
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${filename}`,
  };
  await s3.deleteObject(params).promise()
    .catch(err => {
      cb(null, createResponse('err', 's3.deleteObject error', { error: err }));
      throw (err);
    });
  cb(null, createResponse('ok', '', { data: {} }));
}

export const addFile: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let folder = event.pathParameters['folder'];
  let filename = event.pathParameters['filename'];
  let body = event.body; // TODO: decode
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${filename}`,
    ContentType: 'application/octet-binary',
    Body: body
  };
  await s3.putObject(params).promise()
    .catch(err => {
      cb(null, createResponse('err', 's3.putObject error', { error: err }));
      throw (err);
    });
  cb(null, createResponse('ok', '', { data: {} }));
}
