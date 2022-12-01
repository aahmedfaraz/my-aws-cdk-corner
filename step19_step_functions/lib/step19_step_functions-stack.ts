import { CfnOutput, Duration, Expiration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as stepfunctions_tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

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
    });
    const error_sf = new stepfunctions_tasks.LambdaInvoke(this, `${service}-error`, {
      lambdaFunction: error,
    });

    // Choices
    // Check - 1
    const check_validation_choice = new stepfunctions.Choice(this, `${service}-check-validation-choice`);
    // Check - 2
    const check_db_status_choice = new stepfunctions.Choice(this, `${service}-check-db-status-choice`);
    // Check - 3
    const check_email_status_choice = new stepfunctions.Choice(this, `${service}-check-email-status-choice`);

    // Definition / Chain
    const add_student_definition =
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

    // State machine
    const add_student_state_machine = new stepfunctions.StateMachine(this, `${service}-add-student-state-machine`, {
      stateMachineName: `${service}-add-student-state-machine`,
      definition: add_student_definition,
      stateMachineType: stepfunctions.StateMachineType.EXPRESS,
    });

    // REST API
    const add_student_sf_rest_api = new apigateway.StepFunctionsRestApi(this, `${service}-add-student-sf-rest-api`, {
      restApiName: `${service}-add-student-sf-rest-api`,
      stateMachine: add_student_state_machine,
    });

    const integration = apigateway.StepFunctionsIntegration.startExecution(add_student_state_machine)

    add_student_sf_rest_api.root.addMethod('POST', integration);

    // Appsync Datasource
    const add_student_appsync_datasource = appsyncApi.addHttpDataSource(`${service}-add-student-datasource`, `${add_student_sf_rest_api.url}`, {
      name: `${service}-add-student-datasource`,
    });

    // Resolvers
    add_student_appsync_datasource.createResolver({
      typeName: 'Query',
      fieldName: 'get_success',
      requestMappingTemplate: appsync.MappingTemplate.fromFile('graphql/request.vtl'),
      responseMappingTemplate: appsync.MappingTemplate.fromFile('graphql/response.vtl'),
    });
    add_student_appsync_datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'get_error',
      requestMappingTemplate: appsync.MappingTemplate.fromFile('graphql/request.vtl'),
      responseMappingTemplate: appsync.MappingTemplate.fromFile('graphql/response.vtl'),
    });

    new CfnOutput(this, `rest-api-url`, {
      exportName: `rest-api-url`,
      value: add_student_sf_rest_api.url
    })
    new CfnOutput(this, `rest-api-url-for-path`, {
      exportName: `rest-api-url-for-path`,
      value: add_student_sf_rest_api.urlForPath()
    })

  }
}
