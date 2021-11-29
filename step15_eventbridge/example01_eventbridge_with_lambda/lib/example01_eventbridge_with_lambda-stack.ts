import * as cdk from '@aws-cdk/core';
import * as events from "@aws-cdk/aws-events";
import * as eventsTargets from "@aws-cdk/aws-events-targets";
import * as lambda from "@aws-cdk/aws-lambda";

export class Example01EventbridgeWithLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here


    const producerLambda = new lambda.Function(this, 'producerLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'producer.handler',
    })
    // If any service wants to talk to another service it requires permission for that particular events
    events.EventBus.grantAllPutEvents(producerLambda);

    const consumerLambda = new lambda.Function(this, 'consumerLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'consumer.handler',
    })

    
    const customerOrderingRule = new events.Rule(this, 'customerOrderingRule', {
      ruleName: 'customerOrderingRule',
      description: '',
      targets: [new eventsTargets.LambdaFunction(consumerLambda)],
      eventPattern: {
        source: ['orderService']
      },
    })

    
  }
}
