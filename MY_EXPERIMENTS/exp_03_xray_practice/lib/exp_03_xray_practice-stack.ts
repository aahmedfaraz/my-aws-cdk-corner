import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import * as eventsTargets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as xray from 'aws-cdk-lib/aws-xray';

export class Exp03XrayPracticeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Event Bus
    const myEventBus = new events.EventBus(this, 'my-event-bus', {
      eventBusName: 'W-11',
    });

    // Producer Lambda
    const producerLambda = new lambda.Function(this, 'producer-lambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'producer.handler',
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        EVENT_BUS_NAME: myEventBus.eventBusName,
      },
    })
    // Permission
    events.EventBus.grantAllPutEvents(producerLambda);

    // Consumer Lambdas
    const consumer1Lambda = new lambda.Function(this, 'consumer1-lambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'consumer1.handler',
      tracing: lambda.Tracing.ACTIVE,
    })
    const consumer2Lambda = new lambda.Function(this, 'consumer2-lambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'consumer2.handler',
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        EVENT_BUS_NAME: myEventBus.eventBusName,
      },
    })
    // Permission
    events.EventBus.grantAllPutEvents(consumer2Lambda);
    const deadEndLambda = new lambda.Function(this, 'deadend-lambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'deadend.handler',
      tracing: lambda.Tracing.ACTIVE,
    })

    // Event Rule running consumer lambdas
    new events.Rule(this, 'my-event-rule', {
      enabled: true,
      description: 'This is Event rule will run consumer1 and comsumer2 lambdas',
      eventBus: myEventBus,
      ruleName: 'event-rule-for-W-11-consumers',
      eventPattern: {
        source: ['ahmed']
      },
      targets: [
        new eventsTargets.LambdaFunction(consumer1Lambda),
        new eventsTargets.LambdaFunction(consumer2Lambda),
      ],
    });

    new events.Rule(this, 'my-second-event-rule', {
      enabled: true,
      description: 'This event rule will run deadend lambda',
      eventBus: myEventBus,
      ruleName: 'event-rule-for-W-11-deadend',
      eventPattern: {
        source: ['ahmed', 'faraz']
      },
      targets: [
        new eventsTargets.LambdaFunction(deadEndLambda),
      ]
    })

    // Doing Whatever

    // const ahmedXrayCfnGroup = new xray.CfnGroup(this, 'ahmed-xray-cfn-group', {
    //   groupName: 'Ahmed-Xray-Group',
    // })

  }
}
