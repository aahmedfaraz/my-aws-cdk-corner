import * as AWS from 'aws-sdk';
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

exports.handler = async (event : any) => {
    const allMessages = [
        {
            Id: '0',
            MessageBody: JSON.stringify({
                name: 'Ahmed Faraz',
                designation: 'Full Stack MERN'
            }),
            DelaySeconds: 10,
        },
        {
            Id: '1',
            MessageBody: JSON.stringify({
                name: 'Ahmed Faraz',
                designation: 'Cloud Architect'
            })
        }
    ];

    const sqsBatchParams = {
        Entries: allMessages,
        QueueUrl: SQS_QUEUE_URL || '',
    };

    try {
        const response = await sqs.sendMessageBatch(sqsBatchParams).promise();
        console.info("SQS Response: ", response);
        return response;
    } catch (err) {
        console.error("SQS Error: ", err);
        return err;
    }
}