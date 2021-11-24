import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';
import { UserPoolEmail } from '@aws-cdk/aws-cognito';

export class CdkCognitoGoogleLoginBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Create userpool
    const userpool = new cognito.UserPool(this, 'myuserpool', {
      // 
      // SIGN UP using : *fullname, *email, *phone, *password. ( * means required )
      // SIGN IN using : email, password
      // VERIFYING     : email, phone
      // 
      userPoolName: 'userpool-for-google-and-facebook-login',
      selfSignUpEnabled: true,
      userVerification: {
        // When a user signs up, email and SMS messages are used to verify their account and contact methods
        emailSubject: 'Verify your email for our AhmedFarazApp',
        emailBody: 'Thanks for signing in AhmedFarazApp, Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage: 'Thanks for signing in AhmedFarazApp, Your verification code is {####}',
      },
      userInvitation: {
        // user then receives an invitation to join the user pool
        emailSubject: 'Invite to join AhmedFarazApp',
        emailBody: 'Hi {username}, you have been invited to join AhmedFarazApp! Your temporary password is {####}',
        smsMessage: 'Hi {username}, you have been invited to join AhmedFarazApp! Your temporary password is {####}',
      },
      signInAliases: {
        // user can sign in with their email address
        email: true
      },
      autoVerify: {
        email: true,
        phone: true
      },
      standardAttributes: {
        // defined attributes wanted for signup else custom attributes down below
        fullname: {
          required: true,
          mutable: false
        },
        email: {
          required: true,
          mutable: false
        },
        phoneNumber: {
          required: true,
          mutable: true
        }
      },
      // customAttributes: {
        // 'ZipCode': new cognito.NumberAttribute({ min: 5, max: 5, mutable: true }),
        // 'myappid': new cognito.StringAttribute({ minLen: 5, maxLen: 15, mutable: false }),
        // 'isEmployee': new cognito.BooleanAttribute({ mutable: true }),
        // 'joinedOn': new cognito.DateTimeAttribute(),
      // },
      passwordPolicy: {
        minLength: 8,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      email: UserPoolEmail.withCognito('ahmedfaraz.contact@gmail.com')
      // email: UserPoolEmail.withSES({
      //   sesRegion: 'us-west-2',
      //   fromEmail: 'ahmedfaraz.contact@gmail.com',
      //   fromName: 'Ahmed Faraz\'s Cognito App',
      //   replyTo: 'ahmedfaraz.contact@gmail.com'
      // })
    })

    // Create provider
    const myGoogleProvider = new cognito.UserPoolIdentityProviderGoogle(this, 'myGoogleProvider', {
      userPool: userpool,
      clientId: '916101340968-n98gtsllo99hf62klutkdktd1r9judp8.apps.googleusercontent.com', // MY_GOOGLE_OAUTH_CLIENT_ID
      clientSecret: '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', // MY_GOOGLE_OAUTH_CLIENT_SECRET
      attributeMapping: {
        fullname: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
        email: cognito.ProviderAttribute.GOOGLE_EMAIL,
        phoneNumber: cognito.ProviderAttribute.GOOGLE_PHONE_NUMBERS,
      },
      scopes: ['profile', 'email', 'openid']
    })

    // connect provider and userpool
    userpool.registerIdentityProvider(myGoogleProvider);

    // Create userpool client to use at client side
    const userpoolClient = new cognito.UserPoolClient(this, 'myClientForUserpoolWithGoogleProvider', {
      userPool: userpool,
      oAuth: {
        callbackUrls: ['http://localhost:8000'] // This is the link where user will be redirected to with the code upon signin
      }
    })

    // Define Domain when third party authentication
    const domain = userpool.addDomain('theDomain', {
      cognitoDomain: {
        domainPrefix: 'ahmed-faraz-cog-app'
      }
    })

    // Required Outputs
    new cdk.CfnOutput(this, 'aws_user_pool_id', {
      value: userpool.userPoolId
    })
    new cdk.CfnOutput(this, 'aws_user_pool_web_client_id', {
      value: userpoolClient.userPoolClientId
    })
    new cdk.CfnOutput(this, 'aws_project_region', {
      value: this.region
    })
    new cdk.CfnOutput(this, 'domain', {
      value: domain.domainName
    })
  
  }
}
