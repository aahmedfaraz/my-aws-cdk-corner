import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';

export class Step03AppsyncLambdaAsDatasourceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Created graphql api and specified schema
    const myGraphQlAPI = new appsync.GraphqlApi(this, 'myGraphQlAPI', {
      name: 'my-cdk-appsync-api',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    })
    
    // Created lambda function
    const myLambdaFunction = new lambda.Function(this, 'myLambdaFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'welcome.handler'
    })

    // Created lambdaDataSource (Connecting api with lambda function)
    const myLambdaDataSourceForGraphQlAPI = myGraphQlAPI.addLambdaDataSource('myLambdaDataSourceForGraphQlAPI', myLambdaFunction);

    // Created Resolver on Datasourse(like what will be the query and response)
    myLambdaDataSourceForGraphQlAPI.createResolver({
      typeName: 'Query', // TYPES OF QUERIES ARE: 1. Query(to GET data) 2. Mutation(to UPDATE data) 3. Subscription(for REALTIME calling data)
      fieldName: 'welcome'
    });
    myLambdaDataSourceForGraphQlAPI.createResolver({
      typeName: 'Query', // TYPES OF QUERIES ARE: 1. Query(to GET data) 2. Mutation(to UPDATE data) 3. Subscription(for REALTIME calling data)
      fieldName: 'developer'
    });

    // Getting GraphQL URL and API_KEY as Output
    new cdk.CfnOutput(this, 'myGraphQlUrlOutput', {
      value: myGraphQlAPI.graphqlUrl
    })
    new cdk.CfnOutput(this, 'myGraphQlAPIKEYOutput', {
      value: myGraphQlAPI.apiKey || 'NO_API_KEY_YET'
    })
  }
}
