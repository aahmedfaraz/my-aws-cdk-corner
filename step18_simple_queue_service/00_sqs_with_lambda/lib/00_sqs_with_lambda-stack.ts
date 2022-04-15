import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources'
import * as iam from 'aws-cdk-lib/aws-iam';

export class SqsWithLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // =====================================================================
    // Create a Queue
    // =====================================================================
    const myWelcomeQueue = new sqs.Queue(this, 'my-welcome-queue', {
      queueName: 'my-welcome-queue', // Name of the queue
      encryption: sqs.QueueEncryption.UNENCRYPTED, // Wheather to Encrypt messages or not, default is  unencrypted
      // retentionPeriod: Duration.days(4), // Duration in which SQS will store msgs, 4 days are default
      // fifo: false, // Determines the types of the queue
      // maxMessageSizeBytes: 262144, // Maximum size of messages in Bytes
      // visibilityTimeout: Duration.seconds(30), // Time for which each message waits while being processed before it becomes visible
      // deadLetterQueue: { // Set another Queue to hold messages that failed to process mulitple times
      //   maxReceiveCount: 3,
      //   queue: anyOtherQueue,
      // },
    });

    // =====================================================================
    // Create a Lambda to Send Messages to the Queue
    // =====================================================================
    const mySenderLambda = new lambda.Function(this, 'my-sender-lambda', {
      functionName: 'my-sender-name',
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'sender.handler',
      environment: {
        SQS_QUEUE_URL: myWelcomeQueue.queueUrl
      },
      // timeout: Duration.minutes(15),
    });

    // =====================================================================
    // Give Sender Lambda Permission to Send Msgs to Queue
    // =====================================================================
    mySenderLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['sqs:SendMessage'],
        resources: [myWelcomeQueue.queueArn],
      })
    );

    // =====================================================================
    // Create a Lambda to Batch Send Messages to the Queue
    // =====================================================================
    const myBatchSenderLambda = new lambda.Function(this, 'my-batch-sender-lambda', {
      functionName: 'my-batch-sender-name',
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'batchSender.handler',
      environment: {
        SQS_QUEUE_URL: myWelcomeQueue.queueUrl
      },
      // timeout: Duration.minutes(15),
    });

    // =====================================================================
    // Give Sender Lambda Permission to Send Msgs to Queue
    // =====================================================================
    myBatchSenderLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['sqs:SendMessage'],
        resources: [myWelcomeQueue.queueArn],
      })
    );

    // =====================================================================
    // Create a Lambda to trigger every time SQS Queue recieves any message
    // =====================================================================
    const myConsumerLambda = new lambda.Function(this, 'my-consumer-lambda', {
      functionName: 'my-consumer-name',
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'consumer.handler',
      // timeout: Duration.minutes(15),
    });
    
    // =====================================================================
    // Give Permission to SQS Queue to Trigger Lambda
    // =====================================================================
    myConsumerLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(myWelcomeQueue)
    );
  }
}
