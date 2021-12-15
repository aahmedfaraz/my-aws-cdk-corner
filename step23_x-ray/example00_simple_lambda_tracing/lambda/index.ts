import { APIGatewayProxyResultV2 } from "aws-lambda";
export async function handler(event : any) : Promise<APIGatewayProxyResultV2> {

    console.log('Message ==>> This is Cloud Architect, Ahmed.');
    console.log('Event ==>> ', event);

    return {
        statusCode: 200,
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
            message : 'This is Cloud Architect, Ahmed',
        })
    }
}