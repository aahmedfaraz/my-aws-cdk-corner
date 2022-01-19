import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class Exp05DynamoDbWithPartitionAndSortKeyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const table = new dynamodb.Table(this, 'my-primary-sort-testing-table', {
      tableName: 'my-partition-sort-testing-table',
      partitionKey: {
        name: 'email',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'serviceName',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const addItemLambda = new lambda.Function(this, 'addItemLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'addItem.handler',
      environment: {
        TABLE_NAME: table.tableName
      }
    })

    table.grantFullAccess(addItemLambda)
    // const getAndUpdateItemLambda = new lambda.Function(this, 'getAndUpdateItemLambda', {
    //   runtime: lambda.Runtime.NODEJS_12_X,
    //   code: lambda.Code.fromAsset('lambda'),
    //   handler: 'getAndUpdate.handler'
    // })

  }
}
