import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class Step04AppsyncLambdaDynamodbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // API
    const api = new appsync.GraphqlApi(this, 'myGraphqlApiForLambdaDynamoDB', {
      name: 'my-graphql-api-for-lambda-dynamodb',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
    })

    // Lambda Function
    const lambdaFunc = new lambda.Function(this, 'myLambdaDynamoFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler'
    })

    // LambdaDataSource
    const LambdaDataSource = api.addLambdaDataSource('myLambdaDynamodbDataSource', lambdaFunc);

    // Resolver
    LambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'welcome'
    })
    LambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addProduct'
    })

    // Created a DynamoDB Table
    const myDynamoDbProductTable = new dynamodb.Table(this, 'myDynamoDbProductTable', {
      tableName: 'Ahmed_Faraz_DynamoDB_ProductTable',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })

    // enable the Lambda function to access the DynamoDB table (using IAM)
    myDynamoDbProductTable.grantFullAccess(lambdaFunc);

    lambdaFunc.addEnvironment('TABLE_NAME', myDynamoDbProductTable.tableName);
    
    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });
  }
}
