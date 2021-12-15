import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class Example00SimpleLambdaTracingStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const lambdaForXrayTracing = new lambda.Function(this, 'lambdaForXrayTracing', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      // Enabling x-ray tracing
      tracing: lambda.Tracing.ACTIVE,
    })
  }
}
