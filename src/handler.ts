import AWS = require('aws-sdk');
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: ''
});
let s3 = new AWS.S3({
  region: 'us-east-1',
});

export const listFiles: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let param: AWS.S3.ListObjectsRequest = {
    Bucket: 'ponkore-bucket-001'
  };
  s3.listObjects(param, (err, data) => {
    if (err) {
      console.log('listFIles error=' + err.statusCode + ',message=' + err.message);
      const response = {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          message: 'ERROR!!!' + err.message,
          list: []
        }),
      };
      cb(err, null);
    } else {
      let listResults = data['Contents'];
      listResults.map(d => ({ Key: d['Key'], LastModified: d['LastModified'] }));
      let list = listResults;
      const response = {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          message: 'ok',
          list: listResults
        }),
      };
      cb(null, response);
    }
  });
}

export const readFile: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
      list: ["ab", "cd", "ef"]
    }),
  };
  cb(null, response);
}

export const deleteFiles: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
      list: ["ab", "cd", "ef"]
    }),
  };
  cb(null, response);
}

export const addFile: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let path = event.pathParameters;
  let body = event.body;
  console.log(`event=${event}`);
  console.log(`body size=` + body.length);
  const params = {
    Bucket: 'ponkore-bucket-001',
    Key: 'masao27190/fuga',
    ContentType: 'text/plain',
    Body: event.body
  };
  const response = {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({
      message: 'addFile ok',
    }),
  };
  s3.putObject(params, (err, result) => {
    if (err) {
      console.log(`err=${err}`);
      cb(err, null);
    } else {
      console.log(`result=${result}`);
      console.log(`response=${response}`);
      cb(null, response);
    }
  });
}
