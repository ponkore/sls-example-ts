import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const listFiles: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
            input: event,
            list: ["ab", "cd", "ef"]
        }),
    };
    cb(null, response);
}

export const readFile: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
    const response = {
        statusCode: 200,
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
        body: JSON.stringify({
            message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
            input: event,
            list: ["ab", "cd", "ef"]
        }),
    };
    cb(null, response);
}
