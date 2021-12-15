import { SNSEvent, Context } from "aws-lambda";

export async function handler (event : SNSEvent, context : Context) {
    console.log('event.Records[0].Sns is Here ==>> , ', event.Records[0].Sns);
    console.log('====================================================================');
    console.log('Whole Event Recieved ==>> , ', event);
}