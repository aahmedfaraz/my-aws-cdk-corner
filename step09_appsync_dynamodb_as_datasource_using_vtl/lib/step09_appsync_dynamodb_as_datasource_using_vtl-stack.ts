import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class Step09AppsyncDynamodbAsDatasourceUsingVtlStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const api = new appsync.GraphqlApi(this, 'api_with_dynamo_using_vtl', {
      name: 'API with Dynamo using VTL',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    })

    const dynamoTable = new dynamodb.Table(this, 'notes_table_using_vtl', {
      tableName: 'Notes-Table-using-VTL',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })

    const datasource = api.addDynamoDbDataSource('dynamo_datasource_using_vtl', dynamoTable);

    // Create
    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addNote',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "operation" : "PutItem",
          "key": {
              "id" : $util.dynamodb.toDynamoDBJson($util.autoId())
          },
          "attributeValues" : $util.dynamodb.toMapValuesJson($context.arguments)
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($context.error)
          $util.error($context.error.message, $context.error.type)
        #else
          $util.qr($context.result.put("title", "$context.result.title : concatinated"))
          $util.toJson($context.result)
        #end
      `)
    })
    
    // Read
    datasource.createResolver({
      typeName: 'Query',
      fieldName: 'notes',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "operation" : "Scan"
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($context.error)
          $util.error($context.error.message, $context.error.type)
        #else
          #foreach($item in $context.result.items)
            $util.qr($item.put("title", "$item.title : concatinated"))
          #end
          $util.toJson($context.result.items)
        #end
      `)
    })
    
    // Update
    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateNote',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "operation" : "UpdateItem",
          "key" : {
              "id" : $util.dynamodb.toDynamoDBJson($context.arguments.id)
          },
          "update" : {
            "expression" : "SET #title = :title",
            "expressionNames" : {
              "#title" : "title"
            },
            "expressionValues" : {
              ":title" : $util.dynamodb.toDynamoDBJson($ctx.args.title)
            }
          }
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($context.error)
          $util.error($context.error.message, $context.error.type)
        #else
          $util.toJson($context.result)
        #end
      `)
    })
    
    // Delete
    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteNote',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "operation" : "DeleteItem",
          "key" : {
            "id" : $util.dynamodb.toDynamoDBJson($context.arguments.id)
          }
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($context.error)
          $util.error($context.error.message , $context.error.type)
        #else
          $util.toJson($context.result)
        #end
      `)
    })
  }
}
