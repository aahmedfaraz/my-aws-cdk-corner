# CDK Modules used

- [@aws-cdk/aws-appsync](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-appsync-readme.html)
- [@aws-cdk/aws-lambda](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html)
- [@aws-cdk/aws-dynamodb](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-dynamodb-readme.html)

# Steps

1. Create api using `appsync` on a **graphql-schema**
2. Create a lambda function using `lambda`
3. Connect the api with lambda using **api.addLambdaDataSource**
4. Implement **resolvers(resolver means api endpoints)** on those **LambdaDataSourcecs**, every resolver will be on provided Lambda function
5. Create a DynamoDB table using `dynamodb`
6. On the table give access to lambda functions
7. Add DynamoDB table name inside the Lambda function environment, so we can access it inside our lambda function using environmental variables
8. We now need to call **DynamoDB** inside **Lambda Function** to put data into it, We need to install `aws-sdk`
9. Add data inside the DynamoDB table using **DynamoDB provided by aws-sdk** by providing it, 1. table-name 2. data
10. Build and Deploy to test

# Tips

- Use **if/else** rather than **switch** in lambda functions when working on **graphQl**
- `uuid` dodn't work on it

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
