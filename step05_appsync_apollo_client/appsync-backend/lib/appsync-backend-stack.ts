import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class AppsyncBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Defining Appsync GQL using Schema
    const api = new appsync.GraphqlApi(this, 'myGraphqlApi', {
      name: 'my-graphql-api',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(100))
          }
        }
      }
    })

    // Defining Lambda
    const lambdaFunc = new lambda.Function(this, 'myGraphqlAppsyncLambdaForDynamoDB', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
    })

    // Set the new Lambda function as a data source for the AppSync API
    const apiDatasource = api.addLambdaDataSource('myAppsyncLambdaDatasource', lambdaFunc);

    // Defining API resolvers
    apiDatasource.createResolver({
      typeName: 'Query',
      fieldName: 'welcome'
    })
    apiDatasource.createResolver({
      typeName: 'Query',
      fieldName: 'products'
    })
    apiDatasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addProduct'
    })
    apiDatasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateProduct'
    })
    apiDatasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteProduct'
    })

    // Create DynamoDB Table
    const productsTable = new dynamodb.Table(this, 'myDynamoDBProductsTable', {
      tableName: 'AhmedFaraz_Products',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })

    // enable the Lambda function to access the DynamoDB table (using IAM)
    productsTable.grantFullAccess(lambdaFunc);

    lambdaFunc.addEnvironment('PRODUCT_TABLE_NAME', productsTable.tableName);
  }
}
