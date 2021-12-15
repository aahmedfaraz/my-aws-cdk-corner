import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Example01LambdaSubscriptionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Creating a lambda function
    const lambdaForSubscription = new lambda.Function(this, 'lambdaForSubscription', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler'
    })

    // Creating a SQS Queue to save failed events in it
    const deadletterQueue = new sqs.Queue(this, 'deadletterQueue', {
      queueName: 'DeadLetter_Queue_For_Lambda',
      retentionPeriod: Duration.days(14),
    })

    // Creating a sns topic
    const topicForLambdaSubscription = new sns.Topic(this, 'topicForLambdaSubscription');

    // subscribe lambda function to the topic
    // we have also assinged a filter policy here. The SNS will only invoke the lambda function if the message published on 
    // the topic satisfies the condition in the filter.
    // We have also assigned a dead letter queue to store the failed events
    topicForLambdaSubscription.addSubscription(
      new snsSubscriptions.LambdaSubscription(lambdaForSubscription)
    )

    
  }
}
