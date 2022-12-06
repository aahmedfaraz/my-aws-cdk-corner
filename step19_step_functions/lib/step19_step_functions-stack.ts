import { CfnOutput, Duration, Expiration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as stepfunctions_tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Effect, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

/**
 * ---------------------------------------------------------------------------------------------
 * @desc (Learning Step Functions)
 * Creating an appsync graphql API 
 * with Step Functions as datasource for each endpoint
 * ---------------------------------------------------------------------------------------------
 */
export class Step19StepFunctionsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const service = props?.tags?.service;

    //================================================================================
    //	Appsync : API
    //================================================================================
    const appsyncApi = new appsync.GraphqlApi(
      this,
      `${service}-api`,
      {
        name: `${service}-api`,
        schema: appsync.Schema.fromAsset("graphql/schema.gql"),
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              expires: Expiration.after(Duration.days(365)),
            },
          },
        },
      }
    );

    //================================================================================
    //                            ENDPOINT = add_student
    //================================================================================

    //	Lambda: All Lambdas using for add_student endpoint
    const step01_validate_student = new lambda.Function(this, `${service}-step01-validate-student-lambda`, {
      functionName: `${service}-step01-validate-student-lambda`,
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda/add_student'),
      handler: 'step01_validate_student.handler',
    });
    const step02_add_student = new lambda.Function(this, `${service}-step02-add-student-lambda`, {
      functionName: `${service}-step02-add-student-lambda`,
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda/add_student'),
      handler: 'step02_add_student.handler',
    });
    const step03_send_email = new lambda.Function(this, `${service}-step03-send-email-lambda`, {
      functionName: `${service}-step03-send-email-lambda`,
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda/add_student'),
      handler: 'step03_send_email.handler',
    });
    const step04_create_token = new lambda.Function(this, `${service}-step04-create-token-lambda`, {
      functionName: `${service}-step04-create-token-lambda`,
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda/add_student'),
      handler: 'step04_create_token.handler',
    });
    const error = new lambda.Function(this, `${service}-error-lambda`, {
      functionName: `${service}-error-lambda`,
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda/add_student'),
      handler: 'error.handler',
    });

    //	Step Function: All Lambdas into Step Functions
    const step01_validate_student_sf = new stepfunctions_tasks.LambdaInvoke(this, `${service}-step01-validate-student`, {
      lambdaFunction: step01_validate_student,
    });
    const step02_add_student_sf = new stepfunctions_tasks.LambdaInvoke(this, `${service}-step02-add-student`, {
      lambdaFunction: step02_add_student,
    });
    const step03_send_email_sf = new stepfunctions_tasks.LambdaInvoke(this, `${service}-step03-send-email`, {
      lambdaFunction: step03_send_email,
    });
    const step04_create_token_sf = new stepfunctions_tasks.LambdaInvoke(this, `${service}-step04-create-token`, {
      lambdaFunction: step04_create_token,
      outputPath: '$.Payload'
    });
    const error_sf = new stepfunctions_tasks.LambdaInvoke(this, `${service}-error`, {
      lambdaFunction: error,
      outputPath: '$.Payload'
    });

    // Choices
    // Check - 1
    const check_validation_choice = new stepfunctions.Choice(this, `${service}-check-validation-choice`);
    // Check - 2
    const check_db_status_choice = new stepfunctions.Choice(this, `${service}-check-db-status-choice`);
    // Check - 3
    const check_email_status_choice = new stepfunctions.Choice(this, `${service}-check-email-status-choice`);

    // Definition / Chain
    const definition =
      step01_validate_student_sf // step - 01
        .next(check_validation_choice
          .when(stepfunctions.Condition.isPresent("$.Payload.error"), error_sf) // error
          .when(stepfunctions.Condition.isNotPresent("$.Payload.error"),
            step02_add_student_sf // step - 02
              .next(check_db_status_choice
                .when(stepfunctions.Condition.isPresent("$.Payload.error"), error_sf) // error
                .when(stepfunctions.Condition.isNotPresent("$.Payload.error"),
                  step03_send_email_sf // step - 03
                    .next(check_email_status_choice
                      .when(stepfunctions.Condition.isPresent("$.Payload.error"), error_sf) // error
                      .when(stepfunctions.Condition.isNotPresent("$.Payload.error"),
                        step04_create_token_sf // step - 04
                      )
                    )
                )
              )
          )
        )

    // Log group for State machine
    const logGroup = new logs.LogGroup(this, `${service}-sm-log-group`);

    // State machine
    const stateMachine = new stepfunctions.StateMachine(this, `${service}-state-machine`, {
      stateMachineName: `${service}-state-machine`,
      definition,
      stateMachineType: stepfunctions.StateMachineType.EXPRESS,
      logs: {
        destination: logGroup,
        level: stepfunctions.LogLevel.ALL,
      }
    });

    // IAM Role/Policy for Appsync
    const appsyncApiStepFunctionRole = new Role(this, `${service}-sync-state-machine-role`, {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com')
    });
    appsyncApiStepFunctionRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["states:StartSyncExecution"],
      resources: [stateMachine.stateMachineArn]
    }))

    const endpoint = `https://sync-states.${this.region}.amazonaws.com/`;
    const httpDataSource = appsyncApi.addHttpDataSource(`${service}-appsync-http-datasource-1`, endpoint, {
      name: `${service}-appsync-http-datasource-1`,
      authorizationConfig: {
        signingRegion: this.region,
        signingServiceName: "states"
      }
    })

    stateMachine.grant(httpDataSource.grantPrincipal, "states:StartSyncExecution");

    // Resolvers
    httpDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addStudent',
      requestMappingTemplate: appsync.MappingTemplate.fromString(
        `
        {
          "version": "2018-05-29",
          "method": "POST",
          "resourcePath": "/",
          "params": {
            "headers": {
              "content-type": "application/x-amz-json-1.0",
              "x-amz-target":"AWSStepFunctions.StartSyncExecution"
            },
            "body": {
              "stateMachineArn": "${stateMachine.stateMachineArn}",
              "input": "{ \\\"step\\\": \\\"$context.args.step\\\"}"
            }
          }
        }
        `
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        `
        ## Raise a GraphQL field error in case of a datasource invocation error
        #if($ctx.error)
          $util.error($ctx.error.message, $ctx.error.type)
        #end
        ## if the response status code is not 200, then return an error. Else return the body **
        #if($ctx.result.statusCode == 200)
          ## If response is 200, return the body.
          $ctx.result.body
        #else
          ## If response is not 200, append the response to error block.
          $utils.appendError($ctx.result.body, $ctx.result.statusCode)
        #end
        `
      ),
    });

    // Resolvers
    httpDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'getStudent',
      requestMappingTemplate: appsync.MappingTemplate.fromString(
        `
        {
          "version": "2018-05-29",
          "method": "POST",
          "resourcePath": "/",
          "params": {
            "headers": {
              "content-type": "application/x-amz-json-1.0",
              "x-amz-target":"AWSStepFunctions.StartSyncExecution"
            },
            "body": {
              "stateMachineArn": "${stateMachine.stateMachineArn}",
              "input": "{ \\\"step\\\": \\\"$context.args.step\\\"}"
            }
          }
        }
        `
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        `
        ## Raise a GraphQL field error in case of a datasource invocation error
        #if($ctx.error)
          $util.error($ctx.error.message, $ctx.error.type)
        #end
        ## if the response status code is not 200, then return an error. Else return the body **
        #if($ctx.result.statusCode == 200)
          ## If response is 200, return the body.
          $ctx.result.body
        #else
          ## If response is not 200, append the response to error block.
          $utils.appendError($ctx.result.body, $ctx.result.statusCode)
        #end
        `
      ),
    });

    new CfnOutput(this, 'graphqlUrl', {
      value: appsyncApi.graphqlUrl
    });
    new CfnOutput(this, 'apiKey', {
      value: appsyncApi.apiKey!
    });
    new CfnOutput(this, 'apiId', {
      value: appsyncApi.apiId
    });
    new CfnOutput(this, 'stateMachine', {
      value: stateMachine.stateMachineArn
    });

  }
}
