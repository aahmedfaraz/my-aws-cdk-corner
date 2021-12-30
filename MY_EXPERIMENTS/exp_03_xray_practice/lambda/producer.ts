import * as AWS from 'aws-sdk';
import * as AWSXRAY from 'aws-xray-sdk-core';
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME;

//This Function is genrating random id
const uuidv4 = () => {
    return "xxxx-4xxx-yxxx-".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
};

exports.handler = async (event : any) => {
    const segment = AWSXRAY.getSegment();
    // created new subSegment named GenerateId
    const subSegment = segment?.addNewSubsegment("GenerateId");

    const id = uuidv4();
    const name = "Jhon";
    const company = "panacloud";

    // Adding Annotations to our subsegments
    subSegment?.addAnnotation("userId", id);
    subSegment?.addAnnotation("userName", name);
    subSegment?.addAnnotation("userCompany", company);

    subSegment?.close();

    const eventBridge = AWSXRAY.captureAWSClient(new AWS.EventBridge());
    console.log('WHO ==>> This is Producer');
    const result = await eventBridge.putEvents({
        Entries: [
            {
                EventBusName: EVENT_BUS_NAME,
                Source: 'ahmed'
            }
        ]
    })
    console.log('RESULT ==>> ', result);
}