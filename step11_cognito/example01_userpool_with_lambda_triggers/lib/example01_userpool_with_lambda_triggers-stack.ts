import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cognito from '@aws-cdk/aws-cognito';

export class Example01UserpoolWithLambdaTriggersStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const myPreSignUpLambda = new lambda.Function(this, 'myPreSignUpLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda')
    })

    const userpool = new cognito.UserPool(this, 'MyUserPoolWithLambdaTrigger', {
      // DEFINING USERPOOL
      selfSignUpEnabled: true, // Allows Users to SignUp
      signInAliases: { email : true }, // Set email as sign in alias means now you will use email to sign in
      autoVerify: { email : true }, // Verify email address by sending a Verification Code
      userVerification: {
        // CUSTOMIZE EMAIL AND SMS
        emailSubject: 'Verify your email for AhmedFaraz App using Cognito with Lambda Triggers',
        emailBody: 'Hello {username}, Thanks for signing up to AhmedFaraz App using Cognito with Lambda Triggers, Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage: 'Hello {username}, Thanks for signing up to AhmedFaraz App using Cognito with Lambda Triggers, Your verification code is {####}',
      },
      standardAttributes: {
        // ATTRIBUTES ALREADY DEFINED BY COGNITO
        fullname: {
          required: true,
          mutable: false
        }
      },
      customAttributes: {
        // CUSTOM ATTRIBUTES DEFINED ACCORDING TO APPLICATION NEEDS
        'myappid': new cognito.StringAttribute({ minLen: 5, maxLen: 15, mutable: false })
      },
      passwordPolicy: {
        // PASSWORD POLICY
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: cdk.Duration.days(3)
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,  // Account recovery email
      lambdaTriggers: {
        preSignUp: myPreSignUpLambda, // Trigger before the signup process to userpool
      }
    })
  }
}
