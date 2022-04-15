import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as lambda from '@aws-cdk/aws-lambda';
// import * as pythonLambda from '@aws-cdk/aws-lambda-python';

export class Exp11PythonLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const bucket = s3.Bucket.fromBucketArn(this, 'bucket', 'arn:aws:s3:::temp-avro-bucket');
    
    new s3deploy.BucketDeployment(this, 'deploy-py-dep-pkg', {
      sources: [s3deploy.Source.asset('./s3_root/')],
      destinationBucket: bucket,
      destinationKeyPrefix: 'lambda_zip_file/', // optional prefix in destination bucket
    });

    const pythonLambdaRole = new iam.Role(this, 'ahmed-python-lambda-role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    })

    pythonLambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:GetObject*"],
      resources: ["arn:aws:s3:::temp-avro-bucket/*"]
    }))

    new lambda.Function(this, 'ahmed-python-dep-pkg-lambda', {
      functionName: 'ahmed-python-dep-pkg-lambda',
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromBucket(bucket,'lambda_zip_file/python_dp.zip'),
      handler: 'my_func.handler',
      role: pythonLambdaRole,
    })

    // new pythonLambda.PythonFunction(this, 'ahmed-python-aws-pkg-lambda', {
    //   functionName: 'ahmed-python-aws-pkg-lambda',
    //   entry: '/lambda', // required
    //   runtime: lambda.Runtime.PYTHON_3_8, // required
    //   index: 'my_func.py', // optional, defaults to 'index.py'
    //   handler: 'handler', // optional, defaults to 'handler'
    // });

  }
}
