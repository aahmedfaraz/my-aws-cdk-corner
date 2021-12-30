import * as AWS from 'aws-sdk';
import * as AWSXRay from "aws-xray-sdk-core";
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME;

exports.handler = async (event : any) => {
    const eventBridge = AWSXRay.captureAWSClient(new AWS.EventBridge());
    console.log('WHO ==>> This is consumer2');
    const result = await eventBridge.putEvents({
        Entries: [
            {
                EventBusName: EVENT_BUS_NAME,
                Source: 'faraz'
            }
        ]
    })
    console.log('RESULT ==>> ', result);
    
}