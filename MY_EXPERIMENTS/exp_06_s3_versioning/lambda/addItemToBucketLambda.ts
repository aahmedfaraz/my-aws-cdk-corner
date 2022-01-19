import * as AWS from 'aws-sdk';
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const bucketName = process.env.BUCKET_NAME;

export function handler () {
    const item = {
        email: 'ahmed1@gmail.com',
        age: 21,
        department: 'Software'
    }

    const writeParams = {
        Bucket: bucketName || '',
        Key: `${item.email}.json`,
        Body: Buffer.from([item]),
    }

    const s3Response = s3.putObject(writeParams).promise();

    console.log("S3 RESPONSE ==> ", s3Response);

}