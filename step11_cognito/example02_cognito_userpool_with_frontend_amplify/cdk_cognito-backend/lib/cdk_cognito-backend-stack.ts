import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';

export class CdkCognitoBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const userPool = new cognito.UserPool(this, 'MyUserPoolForAmplify', {
      selfSignUpEnabled: true, // Allows users to signup
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY, // Account Recovery Email
      userVerification: {
        // email verification
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      autoVerify: {
        // auto email verification
        email: true,
      },
      standardAttributes: {
        // attributes required for signup
        email: {
          required: true,
          mutable: true,
        },
        phoneNumber: {
          required: true,
          mutable: true
        }
      }
    })

    // UserPoolClient to connect your UserPool with your Frontend or any other Third party Identity Provider
    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClientForAmplify', {  
      userPool,
    })
    
    // We would be needing below mentioned IDs on out CLIENT SIDE
    // Output UserPool ID
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId
    })
    // Output UserPoolClient ID
    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId
    })
  }
}