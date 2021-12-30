import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as stepFunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as stepFunctionsTasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

export class Exp04StepFunctionsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    // ============================================================================================
    // Step Functions with Simple Chain of Three Lambda Function Tasks
    // ============================================================================================

    // Lambda Functions suppose to run in defined order
    const orderFoodLambda = new lambda.Function(this, 'orderFoodLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'orderFoodLambda.handler',
    });
    const updateDBLambda = new lambda.Function(this, 'updateDBLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'updateDBLambda.handler',
    });
    const updateUiLambda = new lambda.Function(this, 'updateUiLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'updateUiLambda.handler',
    });

    // Step Function Tasks
    const orderFoodTask = new stepFunctionsTasks.LambdaInvoke(this, 'orderFoodTask', {
      lambdaFunction: orderFoodLambda,
      // outputPath: '$.Payload'
    })
    const updateDBTask = new stepFunctionsTasks.LambdaInvoke(this, 'updateDBTask', {
      lambdaFunction: updateDBLambda,
      // inputPath: '$.guid'
    })
    const updateUiTask = new stepFunctionsTasks.LambdaInvoke(this, 'updateUiTask', {
      lambdaFunction: updateUiLambda,
    })

    // Create a Step Function Chain to define sequence of execution
    const myStepFunctionDefinition = stepFunctions.Chain.start(orderFoodTask).next(updateDBTask).next(updateUiTask)

    // Create a State Machine
    new stepFunctions.StateMachine(this, 'myStepFunctionStateMachine', {
      definition: myStepFunctionDefinition,
    })
    
  }
}
