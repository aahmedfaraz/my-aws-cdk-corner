import * as cdk from '@aws-cdk/core';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';

export class Example01RotateSecretWithLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const secretWithNameDefined = new secretsmanager.Secret(this, 'secretWithNameDefined', {
      secretName: 'ahmed-secret-with-name-defined',
    });
    const secretWithNameAutoGenerated = new secretsmanager.Secret(this, 'secretWithNameAutoGenerated');
    const secretWithValueDefined = new secretsmanager.Secret(this, 'secretWithValueDefined', {
      secretName: 'ahmed-secret-with-value-defined',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({}),
        generateStringKey: 'AhmedSecretKey'
      }
    })


    const lambdaFunc = new lambda.Function(this, 'lambdaFuncForSecretsManager',{
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      environment: {
        SECRET_WITH_NAME_DEFINED: `${
          secretsmanager.Secret.fromSecretNameV2(this, 'exampleNameDefined', secretWithNameDefined.secretName).secretValue
        }`,
        SECRET_WITH_NAME_AUTO_GENERATED: `${
          secretsmanager.Secret.fromSecretAttributes(this, 'exampleNameAutoGenerated', {
            secretCompleteArn: secretWithNameAutoGenerated.secretArn
          }).secretValue
        }`,
        SECRET_WITH_VALUE_DEFINED: `${
          secretsmanager.Secret.fromSecretNameV2(this, 'exampleValueDefined', secretWithValueDefined.secretName).secretValue
        }`,
        REGION: cdk.Stack.of(this).region,
        SECRET_NAME_FOR_ROTATION: 'ahmed-secret-with-value-defined',
        KEY_IN_SECRET_NAME: 'AhmedSecretKey'
      }
    });


    lambdaFunc.grantInvoke(new iam.ServicePrincipal('secretsmanager.amazonaws.com'));
    lambdaFunc.addToRolePolicy(new iam.PolicyStatement({
      resources: [secretWithValueDefined.secretArn],
      actions: ['secretsmanager:GetSecretValue', 'secretsmanager:PutSecretValue']
    }));


    secretWithValueDefined.addRotationSchedule('rotationScheduleForsecretWithValueDefined', {
      rotationLambda: lambdaFunc,
      automaticallyAfter: cdk.Duration.hours(24)
    })


  }
}
