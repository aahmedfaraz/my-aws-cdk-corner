import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class Exp06S3VersioningStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const versioningBucket = new s3.Bucket(this, 'myversionbucket', {
      bucketName: 'my-version-bucket',
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const addItemToBucketLambda = new lambda.Function(this, 'addItemToBucketLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'addItemToBucketLambda.handler',
      environment: {
        BUCKET_NAME: versioningBucket.bucketName,
      }
    })

    versioningBucket.grantWrite(addItemToBucketLambda);

  }
}
