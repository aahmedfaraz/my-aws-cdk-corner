import * as AWS from 'aws-sdk';
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

exports.handler = async (event : any) => {

    const messageBody = {
        name: 'Ahmed Faraz',
        designation: 'Cloud Architect'
    }

    const sqsParams = {
        MessageBody: JSON.stringify(messageBody),
        QueueUrl: SQS_QUEUE_URL || '',
        MessageAttributes: {
            'Cloud Provider' : {
                DataType: 'String',
                StringValue: 'Amazon'
            }
        }
    }

    try {
        const response = await sqs.sendMessage(sqsParams).promise();
        console.info("SQS Response : ", response);
        console.info("The MESSAGE has been sent to the QUEUE");
        return response;
    } catch (err) {
        console.error('SQS Error : ', err);
        return err;
    }

}