import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';

export class Step10AppsyncNoDatasourceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const api = new appsync.GraphqlApi(this, 'apiWithNoDatasource', {
      name: 'API with no Datasource',
      schema: appsync.Schema.fromAsset('graphql/schema.gql')
    });

    const datasource = api.addNoneDataSource('noDatasource', {
      name: 'NoDatasource',
      description: 'It does not save the data anywhere just performs operations on data and sends'
    })

    datasource.createResolver({
      typeName: 'Query',
      fieldName: 'readStatus',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "payload" : $util.toJson({
            "status" : "This is current status"
          })
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($context.error)
          $util.error($context.error.message, $context.error.type)
        #else
          $util.toJson($context.result)
        #end
      `),
    })

    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'changeStatus',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "payload" : $util.toJson($context.arguments)
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($context.error)
          $util.error($context.error.message, $context.error.type)
        #else
          $util.qr($context.result.put("status", "Processed : $context.result.status"))
          $util.toJson($context.result)
        #end
      `),
    })
  }
}
