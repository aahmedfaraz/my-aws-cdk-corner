import { Duration, Expiration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as stepfunctions_tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
// import * as apigatewayv2_integration from '@aws-cdk/aws-apigatewayv2-integrations';

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
    const step01_validate_student = new lambda.Function(this, `${service}-step01-validate-student`, {
      functionName: `${service}-step01-validate-student`,
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda/add_student'),
      handler: 'step01_validate_student.handler',
    });
    const step02_add_student = new lambda.Function(this, `${service}-step02-add-student`, {
      functionName: `${service}-step02-add-student`,
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda/add_student'),
      handler: 'step02_add_student.handler',
    });
    const step03_send_email = new lambda.Function(this, `${service}-step03-send-email`, {
      functionName: `${service}-step03-send-email`,
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda/add_student'),
      handler: 'step03_send_email.handler',
    });
    const step04_create_token = new lambda.Function(this, `${service}-step04-create-token`, {
      functionName: `${service}-step04-create-token`,
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda/add_student'),
      handler: 'step04_create_token.handler',
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

    // Definition
    const add_student_definition =
      step01_validate_student_sf
        .next(step02_add_student_sf)
        .next(step03_send_email_sf)
        .next(step04_create_token_sf)

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
      deploy: true,
    });

    // Appsync Datasource
    const add_student_appsync_datasource = appsyncApi.addHttpDataSource(`${service}-add-student-datasource`, add_student_sf_rest_api.url, {
      name: `${service}-add-student-datasource`,
    });

    // Resolvers
    add_student_appsync_datasource.createResolver({
      typeName: 'mutation',
      fieldName: 'add_student'
    });

  }
}
