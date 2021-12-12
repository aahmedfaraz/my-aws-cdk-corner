import { SES } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const ses = new SES();

export async function handler(event : APIGatewayProxyEvent, context : Context): Promise<APIGatewayProxyResult> {
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
        return {
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: 200,
            body: JSON.stringify(params)
        }
    } catch (error) {
        console.log('error sending email ', error);
        return {
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: 400,
            body: JSON.stringify({
                error,
            })
        }
    }
    
}