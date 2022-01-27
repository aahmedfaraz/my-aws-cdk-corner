import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as glue from "@aws-cdk/aws-glue";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as lambda from "@aws-cdk/aws-lambda";
import { CfnOutput } from "@aws-cdk/core";

export class Exp02S3CustomerPreferencesUsingGluePythonStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const role = new iam.Role(this, "access-glue-fifa", {
      assumedBy: new iam.ServicePrincipal("glue.amazonaws.com"),
    });

    const importedBucketFromName = s3.Bucket.fromBucketArn(
      this,
      "data-bucket",
      "arn:aws:s3:::tb-customer-preferences"
    );

    // Add AWSGlueServiceRole to role.
    const gluePolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "service-role/AWSGlueServiceRole"
    );
    role.addManagedPolicy(gluePolicy);

    const glueS3Bucket = new s3.Bucket(this, "GlueFifaBucket", {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
    });
    
    const dependenciesS3Bucket = new s3.Bucket(this, "DependenciesBucket", {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
    });

    // Assign role to S3 bucket
    glueS3Bucket.grantReadWrite(role);
    dependenciesS3Bucket.grantReadWrite(role);
    importedBucketFromName.grantReadWrite(role);

    new s3deploy.BucketDeployment(this, "DeployGlueJobFiles", {
      sources: [s3deploy.Source.asset("./script")],

      destinationBucket: glueS3Bucket,
    });

    new s3deploy.BucketDeployment(this, "Dependencies", {
      sources: [s3deploy.Source.asset("./dependencies")],

      destinationBucket: dependenciesS3Bucket,
    });

    // JOb 1
    const processFifaDataJobName = "process-data-fifa";
    const glueJob = new glue.Job(this, processFifaDataJobName, {
      executable: glue.JobExecutable.pythonShell({
        glueVersion: glue.GlueVersion.V1_0,
        pythonVersion: glue.PythonVersion.THREE,
        script: glue.Code.fromBucket(glueS3Bucket, "main.py"),
      }),
      defaultArguments: {
        "--extra-py-files": `${dependenciesS3Bucket.s3UrlForObject()}/additional_modules-0.1-py3-none-any.whl`,
      },
      // description: "Json to Parquet",
      description: "Output in JSON",
      role: role,
    });

    const coalesceLambda = new lambda.Function(this, "coalesceLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.AssetCode.fromAsset("lambda"),
      handler: "coalesce.handler",
      environment: {
        JOB_NAME: glueJob.jobName,
      },
    });
    
    const glue_policy = new iam.PolicyStatement({
      actions: ["glue:*"],
      resources: ["*"],
    });

    coalesceLambda.role?.attachInlinePolicy(
      new iam.Policy(this, "GlueLambdaPolicy", {
        statements: [glue_policy],
      })
    );
    // Workflow
    new glue.CfnWorkflow(this, "glue-fifa-workflow", {
      name: "glue-fifa-workflow",
    });

    // Create a trigger for load data job.
    const loadDataJobTriggerName = "trigger-get-data-fifa";
    new glue.CfnTrigger(this, loadDataJobTriggerName, {
      name: loadDataJobTriggerName,
      schedule: "cron(0 0 1 * ? *)",
      type: "SCHEDULED",
      description: "",
      actions: [
        {
          jobName: processFifaDataJobName,
        },
      ],
      startOnCreation: true,
      workflowName: "glue-fifa-workflow",
    });

    new CfnOutput(this, "Ouput1", {
      value: dependenciesS3Bucket.bucketWebsiteUrl,
    });
    new CfnOutput(this, "Ouput2", {
      value: dependenciesS3Bucket.bucketName,
    });
    new CfnOutput(this, "Ouput3", {
      value: dependenciesS3Bucket.bucketDomainName,
    });
    new CfnOutput(this, "Ouput4", {
      value: dependenciesS3Bucket.s3UrlForObject(),
    });

  }
}
