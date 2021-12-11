import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as sesActions from 'aws-cdk-lib/aws-ses-actions';

export class Example01InvokeLambdaOnReceivingEmailStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Setting a lambda function which will be run on receiving emails
    const lambdaForReceivingEmails = new lambda.Function(this, 'lambdaForReceivingEmails', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
    });


    // Creating a new rule set
    const ruleSet = new ses.ReceiptRuleSet(this, 'RuleSet', {
      receiptRuleSetName: 'Rule-Set-Calling-Lambda',
    })

    
    // Adding a rule inside the rule set
    ruleSet.addRule('RULE_TO_INVOKE_LAMBDA', {
      recipients: ['demo1@faraz.extechsolution.com'], // If no recipients than the action will be called on any incoming mail addresses of verified domains
      actions: [
        new sesActions.Lambda({ // defining an action to call when receive email on given recipients
          function: lambdaForReceivingEmails,
          invocationType: sesActions.LambdaInvocationType.EVENT
        })
      ],
      scanEnabled: true, // Enable spam and virus scanning
    })

  }
}
