import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

export class Example01LambdaWithS3TracingStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Creating a role for lambda function
    const roleForLambda = new iam.Role(this, 'roleForLambda', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    })

    // Creating S3 read only access policy to the role
    const policyForS3ReadOnlyAccess = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:Get*", "s3:List*"],
      resources: ['*']
    })

    // Granting iam policy to role
    roleForLambda.addToPolicy(policyForS3ReadOnlyAccess);

    // Creating a lambda
    new lambda.Function(this, 'lambda-s3-x-ray-tracing', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      // Enabling x-ray tracicng
      tracing: lambda.Tracing.ACTIVE,
      role: roleForLambda,
      timeout: Duration.minutes(1)
    })


  }
}
