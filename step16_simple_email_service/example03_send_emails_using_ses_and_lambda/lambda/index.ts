import { SES } from "aws-sdk";

const ses = new SES();

export async function handler(event : any, context : any): Promise<any> {
    console.log("REQUEST ==>> ", event.body);

    const params = {
        Destination: {
            ToAddresses: ['ahmedfaraz838383@gmail.com'],
        },
        Message: {
            Body: {
                Text: { Data: 'This is Cloud Engineer Ahmed Faraz.' },
            },
            Subject: { Data: 'Hello-CDK' },
        },
        Source: 'ahmed@awsfaraz.website',
    };

    try {
        await ses.sendEmail(params).promise();
        console.log('Email has been sent,', params);
    } catch (error) {
        console.log('error sending email ', error);
    }
    
}