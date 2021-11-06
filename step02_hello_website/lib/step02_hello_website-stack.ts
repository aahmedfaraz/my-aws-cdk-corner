import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';

export class Step02HelloWebsiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Created a S3 Bucket
    const myWebsiteBucket = new s3.Bucket(this, 'websiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    // Created Cloudfront Distribution and specified it's origin to our S3 Bucket
    const myWebsiteCloudfrontDistribution = new cloudfront.Distribution(this, 'myWebsiteCloudfrontDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(myWebsiteBucket)
      }
    })

    // Defining Outputs
    new cdk.CfnOutput(this, 'AhmedFarazWebsite', {
      value: myWebsiteCloudfrontDistribution.domainName
    })

    // Created S3 Bucket deployment (L2 Contruct)
    // Specified our S3 Bucket as destinationBucket and 
    // our cloudfront distribution as well
    new s3deploy.BucketDeployment(this, 'deployWebsite', {
      sources: [s3deploy.Source.asset('./client')], // Give path according to root
      destinationBucket: myWebsiteBucket,
      //destinationKeyPrefix: 'web/static', // <--- It will create web folder then static folder inside it and then our data in static folder (so not required)
      distribution: myWebsiteCloudfrontDistribution
    })
  }
}
