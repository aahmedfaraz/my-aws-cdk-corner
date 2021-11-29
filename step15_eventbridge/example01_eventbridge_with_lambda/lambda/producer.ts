import { EventBridge } from 'aws-sdk';

exports.handler = async (event:any) => {


    const eventBridge = new EventBridge();
    const result = await eventBridge.putEvents({
        Entries: [
            {
                EventBusName: 'default',
                Source: 'orderService',
                DetailType: 'addOrder',
                Detail: JSON.stringify({
                    productName: 'T-shirt',
                    productPrice: 100,
                    customerName: 'Ahmed'
                })
            }
        ]
    }).promise();


    console.log('request : ', JSON.stringify(result));
    return ({
        statusCode: 200,
        headers: {
            'Content/Type' : 'text/plain'
        },
        body: `Producer Event, New Hello, CDK! You've hit, ${JSON.stringify(result)}\n`
    })
}