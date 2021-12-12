import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class Example03SendEmailsUsingSesAndLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Creating a IAM role for lambda, to give it access to send emails using SES
    const role = new iam.Role(this, 'lambda-role-to-send-mails', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    })
    // Creating a IAM policy, attaching SES access to it
    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ses:SendEmail', 'ses:SendRawEmail', 'logs:*'],
      resources: ['*']
    })
    // Granting IAM permissions to role
    role.addToPolicy(policy);


    // Creating lambda handler to send emails
    const emailSenderLambda = new lambda.Function(this, 'emailSenderLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      role,
    })
  }
}
