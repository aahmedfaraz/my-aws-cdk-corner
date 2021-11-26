import * as cdk from '@aws-cdk/core';
import * as cognito from "@aws-cdk/aws-cognito";


export class CdkBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const userpool = new cognito.UserPool(this, 'myGoogleUserPool',{
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      userVerification: {
        emailSubject: 'Verify your email for our AhmedFarazApp',
        emailBody: 'Thanks for signing in AhmedFarazApp, Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage: 'Thanks for signing in AhmedFarazApp, Your verification code is {####}',
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        }
      }
    });



    const myGoogleProvider = new cognito.UserPoolIdentityProviderGoogle(this, 'myGoogleProvider', {
      userPool: userpool,
      clientId: '36841164332-r5a32cmb5gjs0lqco1geplnnnubdfp8c.apps.googleusercontent.com',
      clientSecret: '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',
      attributeMapping: {
        email: cognito.ProviderAttribute.GOOGLE_EMAIL,
        givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME
      },
      scopes: ["profile", "email", "openid"],
    })


    userpool.registerIdentityProvider(myGoogleProvider);


    const userpoolClient = new cognito.UserPoolClient(this, 'myAmplifyClient', {
      userPool: userpool,
      oAuth: {
        callbackUrls: ["http://localhost:8000/"],
        logoutUrls: ["http://localhost:8000/"]
      }
    })


    const domain = userpool.addDomain('domain', {
      cognitoDomain: {
        domainPrefix: 'my-cog-app'
      }
    })

    

    new cdk.CfnOutput(this, "aws_user_pools_web_client_id", {
      value: userpoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, "aws_project_region", {
      value: this.region,
    });
    new cdk.CfnOutput(this, "aws_user_pools_id", {
      value: userpool.userPoolId,
    });

    new cdk.CfnOutput(this, "domain", {
      value: domain.domainName,
    });


  }
}
