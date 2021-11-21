import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class Step08AppsyncDynamodbAsDatasourceMappingtempleteMethodsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const api = new appsync.GraphqlApi(this, 'api_using_dynamo_as_datasource', {
      name: 'API using DynamoDB as Datasource',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    })

    const dynamoTable = new dynamodb.Table(this, 'notes_table', {
      tableName: 'Notes-Table',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })

    const datasource = api.addDynamoDbDataSource('datasource', dynamoTable);

    // Create
    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addNote',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(appsync.PartitionKey.partition('id').auto(), appsync.Values.projecting()),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    })

    // Read
    datasource.createResolver({
      typeName: 'Query',
      fieldName: 'notes',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
    })

    // Update
    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateNote',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(appsync.PartitionKey.partition('id').is('id'), appsync.Values.projecting()),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    })

    // Delete
    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteNote',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem('id', 'id'),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    })
  }
}
