import * as cdk from '@aws-cdk/core';
import * as events from '@aws-cdk/aws-events';

export class Exp12CrossAccountEventBridgeSendingEventsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'Exp12CrossAccountEventBridgeSendingEventsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
