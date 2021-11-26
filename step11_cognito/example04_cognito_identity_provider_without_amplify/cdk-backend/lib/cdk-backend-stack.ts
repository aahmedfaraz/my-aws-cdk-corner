import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';

export class CdkBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userpool = new cognito.UserPool(this, 'myUserPoolForCogWithoutAmplify', {
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: 'Verify your email for AhmedFaraz App',
        emailBody: 'Hi! Thanks for Signing up, your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      signInAliases: {
        username: true,
        email: true,
      },
      autoVerify: {
        email: true,
      },
      signInCaseSensitive: true,
      standardAttributes: {
        fullname: {
          required: true,
          mutable: true,
        },
        email: {
          required: true,
          mutable: false,
        }
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    })



    const client = new cognito.UserPoolClient(this, 'myUserpoolClient', {
      userPool: userpool,
      generateSecret: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true
        },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
        callbackUrls: [`http://localhost:8000/dashboard`],
        logoutUrls: [`http://localhost:8000`]
      }
    });



    const domain = userpool.addDomain('CognitoDomain', {
      cognitoDomain: {
        domainPrefix: 'app-without-amp'
      }
    });



    const signInUrl = domain.signInUrl(client, {
      redirectUri: `http://localhost:8000/dashboard`
    });
    

  }
}
