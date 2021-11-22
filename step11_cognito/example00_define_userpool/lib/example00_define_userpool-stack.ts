import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';

export class Example00DefineUserpoolStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const userpool = new cognito.UserPool(this, 'MyFirstUserPool', {
      // DEFINING USERPOOL
      selfSignUpEnabled: true, // Allows Users to SignUp
      signInAliases: { email : true }, // Set email as sign in alias means now you will use email to sign in
      autoVerify: { email : true }, // Verify email address by sending a Verification Code
      userVerification: {
        // CUSTOMIZE EMAIL AND SMS
        emailSubject: 'Verify your email for AhmedFaraz App!',
        emailBody: 'Hello {username}, Thanks for signing up to AhmedFaraz App, Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage: 'Hello {username}, Thanks for signing up to AhmedFaraz App, Your verification code is {####}'
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
        "myappid": new cognito.StringAttribute({minLen: 5, maxLen: 15, mutable: false})
      },
      passwordPolicy: {
        // PASSWORD POLICY
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: cdk.Duration.days(3)
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY // Account recovery email
    })
  }
}
