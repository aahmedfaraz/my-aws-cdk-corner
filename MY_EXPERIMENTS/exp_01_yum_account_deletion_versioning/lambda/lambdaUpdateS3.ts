import * as AWS from 'aws-sdk';
var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const BUCKET_NAME = process.env.BUCKET_NAME;

exports.handler = async (event : any) => {
    const writeParams = {
        Bucket: BUCKET_NAME || '',
        Key: 'ahmed-faraz-1.json',
        Body: Buffer.from([
            {
                email: 'ahmed-faraz-1@gmail.com',
                status: true
            }
        ])
    }
    const s3Respose = await s3.putObject(writeParams).promise()
    console.log('RESULT ==>> ', s3Respose);
}