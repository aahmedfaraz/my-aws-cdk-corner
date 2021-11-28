import * as cdk from '@aws-cdk/core';
import * as codePipeline from '@aws-cdk/aws-codepipeline';
import * as codePipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as codeBuild from '@aws-cdk/aws-codebuild';

export class Example01SetupBasicPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const stackName = 'DemoCdkBackendStack'; // Stack of the Project to be deployed
    
    //Code build action, Here you will define a complete build
    const cdkBuild = new codeBuild.PipelineProject(this, 'CdkBuild', {
      buildSpec: codeBuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            "runtime-versions": {
              "nodejs": 12
            },
            commands: [
              'npm install'
            ],
          },
          build: {
            commands: [
              'npm run build',
              'npm run cdk synth -- -o dist' // We are saying here: We want to create a file 'dist' and we want to store our cloud formation in it
            ],
          },
        },
        artifacts: {
          'base-directory': './dist', //outputting our generated JSON CloudFormation files to the dist directory
          files: [
            `${stackName}.template.json`,
          ],
        },
      }),
      environment: {
        buildImage: codeBuild.LinuxBuildImage.STANDARD_3_0,  ///BuildImage version 3 because we are using nodejs environment 12
      },
    });


    // Define a pipeline
    const pipeline = new codePipeline.Pipeline(this, 'myCDKPipeline', {
      crossAccountKeys: false,  //Pipeline construct creates an AWS Key Management Service (AWS KMS) which cost $1/month. this will save your $1.
      restartExecutionOnUpdate: true,  //Indicates whether to rerun the AWS CodePipeline pipeline after you update it.
    });


    // Artifact is a Temporary storage to transfer data to the different stages of the pipeline
    // Artifact for storing sourceCode
    const sourceCodeOutput = new codePipeline.Artifact();
    // Artifact for storing cdk build
    const cdkBuildOutput = new codePipeline.Artifact();


    // Stage 1 - Fetching the Source Code from Github Repo (https://github.com/aahmedfaraz/demo_cdk_backend)
    pipeline.addStage({
      stageName: 'Fetch_Source_Code_from_GitHub',
      actions: [
        new codePipelineActions.GitHubSourceAction({
          actionName: 'Checkout',
          owner: 'aahmedfaraz',
          repo: 'demo_cdk_backend',
          oauthToken: cdk.SecretValue.plainText('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'),
          output: sourceCodeOutput,
          branch: 'main'
        })
      ]
    })


    // Stage 2 - Build the CDK
    pipeline.addStage({
      stageName: 'BuildCDK',
      actions: [
        new codePipelineActions.CodeBuildAction({
          input: sourceCodeOutput,
          actionName: 'cdkBuild',
          project: cdkBuild, // build command
          outputs: [cdkBuildOutput],
        })
      ]
    });


    // Stage 3 - Deploy the CDK
    pipeline.addStage({
      stageName: 'DeployCDK',
      actions: [
        new codePipelineActions.CloudFormationCreateUpdateStackAction({
          actionName: 'AdministerPipeline',
          templatePath: cdkBuildOutput.atPath(`${stackName}.template.json`), //Input artifact with the CloudFormation template to deploy
          stackName: stackName,
          adminPermissions: true,
        })
      ]
    })


  }
}
