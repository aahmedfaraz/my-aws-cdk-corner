import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';

export class Exp07S3DeploymentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const bucket = new s3.Bucket(this, 'my-bucket-deployment-testing', {
      bucketName: 'my-bucket-deployment-testing',
    })

    new s3Deploy.BucketDeployment(this, 'bucket-deployment-testing', {
      sources: [
        s3Deploy.Source.asset("./script/ahmed.json")
      ],
      destinationBucket: bucket,
    })
  }
}
