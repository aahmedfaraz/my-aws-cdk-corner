import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class Exp01YumAccountDeletionVersioningStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // S3 to track versioned records
    const s3BucketForVersioning = new s3.Bucket(this, 's3-bucket-for-versioning', {
      bucketName: 's3-bucket-for-versioning',
      versioned: true
    })

    // Lambda to update S3
    const lambdaUpdatS3 = new lambda.Function(this, 'lambdaUpdateS3', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'lambdaUpdateS3.handler',
      environment: {
        BUCKET_NAME: s3BucketForVersioning.bucketName
      }
    })

    s3BucketForVersioning.grantWrite(lambdaUpdatS3);

  }
}
