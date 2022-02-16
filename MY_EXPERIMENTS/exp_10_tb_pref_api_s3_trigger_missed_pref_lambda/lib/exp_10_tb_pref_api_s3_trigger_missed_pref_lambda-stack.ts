import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';

export class Exp10TbPrefApiS3TriggerMissedPrefLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const expBucket = new s3.Bucket(this, 'exp-upload-bucket-to-trig-lambda', {
      bucketName: 'exp-upload-bucket-to-trig-lambda',
    })

    // const uploadBucketLambda = new lambda.Function(this, 'exp-bucket-trigger-lambda', {
    //   functionName: 'exp-bucket-trigger-lambda',
    //   runtime: lambda.Runtime.NODEJS_12_X,
    //   code: lambda.Code.fromAsset('lambda'),
    //   handler: 'uploadBucketLambda/handler',
      
    // })
  }
}
