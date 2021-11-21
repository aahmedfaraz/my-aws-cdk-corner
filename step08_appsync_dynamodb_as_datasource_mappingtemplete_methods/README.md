# That's how we use Dynamo as Datasource on Appsync using Mapping Template

```js
const api = /* api using appsync */
const dynamoTable = /* dynamo table using dynamodb */

const datasource = api.addDynamoDbDataSource('datasource', dynamoTable);

datasource.createResolver({
    typeName: 'Mutation',
    fieldName: 'addNote',
    requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(appsync.PartitionKey.partition('id').auto(), appsync.Values.projecting()),
    responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
})

```

- See whole CRUD in `lib/step08_appsync_dynamodb_as_datasource_mappingtemplete_methods-stack.tsx`

# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
