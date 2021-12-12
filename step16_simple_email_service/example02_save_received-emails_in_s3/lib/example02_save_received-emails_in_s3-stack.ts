import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as sesActions from 'aws-cdk-lib/aws-ses-actions';

export class Example02SaveReceivedEmailsInS3Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // creating a new bucket to save emails
    const bucketToSaveMails = new s3.Bucket(this, 'bucketToSaveMails', {
      bucketName: 'bucket-to-save-emails', // name can use small letters with (-) sign, can't use capital letters neither (_) sign
    });


    // creating a new rule set
    const ruleSetToSaveMailsInS3 = new ses.ReceiptRuleSet(this, 'ruleSetToSaveMailsInS3', {
      receiptRuleSetName: 'ruleSetToSaveMailsInS3',
    });


    //  ----- WE CAN INTRODUCE PARAMETERS LIKE THIS ------
    // creating instance for taking email input while deployment
    // ref https://docs.aws.amazon.com/cdk/latest/guide/parameters.html
    // const emailAddress = new cdk.CfnParameter(this, 'emailParam', {
    //   type: 'String', description: "Write your recipient email"
    // });
    //  ----- ------------------------------------- ------
    

    // Adding a rule inside a rule set
    ruleSetToSaveMailsInS3.addRule('SAVE_MAILS_RULE', {
      recipients: ['ahmed@awsfaraz.website'], // if no recipients than the action will be called on any incoming mail addresses of verified domains
      actions: [
        new sesActions.S3({
          bucket: bucketToSaveMails,
          objectKeyPrefix: 'faraz_company_emails/', // will save all emails inside 'faraz_company_emails' directory
        })
      ],
      scanEnabled: true, // Enable spam and virus scanning
    })
  }
}
