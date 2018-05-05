import AWS = require('aws-sdk');
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

const S3 = new AWS.S3({
  region: 'us-east-1',
});

const BUCKET_NAME = 'ponkore-bucket-001';

const ok = (data: any) => {
  let body = Object.assign({
    status: 'ok',
    message: ''
  }, data);
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(body)
  };
}

const err = (message: string, data: any) => {
  let body = Object.assign({
    status: 'err',
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
        cb(null, err('data[Contents] is undefined', {}));
        return;
      }
      let list = data['Contents'].map(d => ({ Key: d['Key'], LastModified: d['LastModified'] }));
      cb(null, ok({ list: list }));
    })
    .catch(err => cb(null, err('s3.listObjects error', { error: err })));
}

export const readFile: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  cb(null, ok({ data: {} }));
}

export const deleteFiles: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let folder = event.pathParameters['folder'];
  let filename = event.pathParameters['filename'];
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${filename}`,
  };
  S3.deleteObject(params).promise()
    .then(data => cb(null, ok({ data: data })))
    .catch(err => cb(null, err('s3.deleteObject error', { error: err })));
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
    .then(data => cb(null, ok({ data: data })))
    .catch(err => cb(null, err('s3.putObject error', { error: err })));
}

////////////////////////////////////////////////////////////////////////////////
// experimental
////////////////////////////////////////////////////////////////////////////////
const listIdeasData = [
  {
    commentCount: 3,
    id: '1',
    lastUpdate: '2018-04-01 10:01:12',
    newSign: false,
    title: '報告書用データの一元化（エクセル集計表の作成）',
    userName: '社員Ａ',
  },
  {
    commentCount: 2,
    id: '2',
    lastUpdate: '2018-04-03 10:56:12',
    newSign: false,
    title: '紙書類のPDFデータ化',
    userName: '社員Ｂ',
  },
  {
    commentCount: 8,
    id: '3',
    lastUpdate: '2018-04-04 11:01:22',
    newSign: false,
    title: '部内の共有データを体系的に整理',
    userName: '社員Ｃ',
  },
  {
    commentCount: 2,
    id: '4',
    lastUpdate: '2018-04-05 14:01:12',
    newSign: false,
    title: 'データは３箇所に保存',
    userName: '社員Ｂ',
  },
  {
    commentCount: 3,
    id: '5',
    lastUpdate: '2018-04-09 10:00:12',
    newSign: true,
    title: 'エクセルで業務日誌を作成',
    userName: '社員Ｄ',
  },
  {
    commentCount: 3,
    id: '6',
    lastUpdate: '2018-04-10 16:07:10',
    newSign: false,
    title: '郵便物管理簿をエクセル化',
    userName: '社員Ｅ',
  },
  {
    commentCount: 2,
    id: '7',
    lastUpdate: '2018-04-18 16:45:10',
    newSign: false,
    title: 'エクセルでファイルの背表紙を作成',
    userName: '社員Ｆ',
  },
  {
    commentCount: 2,
    id: '8',
    lastUpdate: '2018-04-19 16:32:15',
    newSign: false,
    title: '保存ファイルのリストを作成',
    userName: '社員Ｇ',
  },
  {
    commentCount: 2,
    id: '9',
    lastUpdate: '2018-04-23 15:07:10',
    newSign: false,
    title: 'ファイリングの際はカラー用紙を仕切りとして活用',
    userName: '社員Ａ',
  },
  {
    commentCount: 2,
    id: '10',
    lastUpdate: '2018-04-25 17:27:10',
    newSign: true,
    title: '２個のファイルボックスで、書類を整理',
    userName: '社員Ｉ',
  }
];

export const listIdeas: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  cb(null, ok({ data: listIdeasData }));
}

const ideaShowPageCardData = [{
  headerText: "Re:報告書用データの一元化（エクセル集計表の作成）",
  userName: "社員Ａ",
  dateTime: "2018-04-01 10:01:12",
  likecount: 4,
  cocount: 2,
  cardText: `
【改善前】<br />
年度末に事業報告等の報告ものが集中し、集計に追われ、残業で対応していた。報告書の中には似たような集計もあるが、報告書ごとに対応していたために、事務が煩雑になっていた。

【改善後】<br />
集計表の工夫により似たような報告物が一つの集計で対応できるエクセル表を作成し、月報方式をとり、翌月の１５日までに集計しまとめ、回覧し報告することで、人によって把握方法が変わることが少なくなり、正確な数値の把握が出来、エクセル表を使用することで、年度末集計が簡易になった。

集計表のフォーマットは、共有サーバにありますので、ご利用下さい。
`,
}, {
  headerText: "Re:報告書用データの一元化（エクセル集計表の作成）",
  userName: "社員Ｂ",
  dateTime: "2018-04-03 10:01:12",
  likecount: 4,
  cocount: 2,
  cardText: `年度末には業務が集中するので、私も困っておりました。ぜひ利用させてください。`,
}, {
  headerText: "Re:報告書用データの一元化（エクセル集計表の作成）",
  userName: "社員Ｃ",
  dateTime: "2018-04-03 10:02:12",
  likecount: 4,
  cocount: 2,
  cardText: `
集計表のフォーマット確認させていただきました。
しかし、ご提示のフォーマットでは、私の部門では対応しにくい部分もありました。
つきましては、自部門でも対応できるフォーマットに改善したいので協力させてください。
`,
}];

export const showIdea: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  cb(null, ok({ data: ideaShowPageCardData }));
}

export const login: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let params = event.queryStringParameters;
  let { username, password } = params;
  if (username === 'aaa') {
    cb(null, ok({ result: 'ok' }));
  } else {
    cb(null, ok({ result: 'failed' }));
  }
}