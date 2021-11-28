import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamo from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import { Role } from '@aws-cdk/aws-iam';

export class Step12GrantIamPolicyToResourcesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const api = new appsync.GraphqlApi(this, 'myGqlApiUsingIamPolicy', {
      name: 'MY_GQL_API_using_IAM_Policy',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          }
        }
      }
    });


    const dynamoTable = new dynamo.Table(this, 'myDynamoDbUsingIAM', {
      tableName: 'My_DynamoDB_using_IAM',
      partitionKey: {
        name: 'id',
        type: dynamo.AttributeType.STRING,
      },
    });


    // create a specific role for lambda function
    const lambdaRole = new iam.Role(this, 'myLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // attach dynamodb access to policy
    const dynamoAccessPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:PutItem', 'dynamodb:Scan', 'dynamodb:GetItem'],
      resources: [dynamoTable.tableArn],
    });
    const logsAccessPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:*'],
      resources: ['*']
    });

    // granting IAM permissions to role
    lambdaRole.addToPolicy(dynamoAccessPolicy);
    lambdaRole.addToPolicy(logsAccessPolicy);


    const myLambda = new lambda.Function(this, 'myLambdaUsingIAM', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      role: lambdaRole,
      environment: {
        'TABLE_NAME': dynamoTable.tableName,
      }
    });


    const datasource = api.addLambdaDataSource('myLambdaDatasourceUsingIAM', myLambda);


    datasource.createResolver({
      typeName: 'Query',
      fieldName: 'welcome',
    });
    datasource.createResolver({
      typeName: 'Query',
      fieldName: 'getData',
    });
    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addData',
    });
    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteData',
    });


  }
}
