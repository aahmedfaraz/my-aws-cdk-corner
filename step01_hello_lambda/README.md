# Outputs:

- Step01HelloLambdaStack.myluckyapiEndpoint36D477C3 = [https://1jqfhc18p6.execute-api.us-west-2.amazonaws.com/prod/](https://1jqfhc18p6.execute-api.us-west-2.amazonaws.com/prod/), use with `/hello`
- Step01HelloLambdaStack.myaboutapiEndpoint406CBE06 = [https://34w569y12i.execute-api.us-west-2.amazonaws.com/prod/](https://34w569y12i.execute-api.us-west-2.amazonaws.com/prod/), use with `/about`

# My Steps

1. Create a folder and initialize CDK app in it.

```powershell
cdk init app --language typescript
```

2. Install AWS-Lambda package.

```powershell
yarn add @aws-cdk/aws-lambda
```

- Since due to typescript, we also needs to get types of aws-lambda.

```powershell
yarn add @types/aws-lambda
```

3. Create a folder `lambda` in root (you can name it any name), to define lambda functions in it. i.e., `hello.js` here.

4. Add your lambda function code in it.

```js
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.log("request:", JSON.stringify(event, undefined, 2));

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, Ahmed Faraz The Cloud Architect!. You've hit ${event.path}\n`,
  };
}
```

5. Initialize your lambda function inside stack.

```js
import * as lambda from "@aws-cdk/aws-lambda";

const hello = new lambda.Function(this, "HelloAhmedHandler", {
  runtime: lambda.Runtime.NODEJS_10_X, // Specifying which type of function we have deployed
  code: lambda.Code.fromAsset("lambda"), // 'lambda' is the folder containing all lambda function
  handler: "hello.handler", // 'hello' is the file name and 'handler' is the function name
});
```

6. `NOTE: This stack uses assets`, so the environment needs to be [bootstrapped](https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html). using command,

```powershell
cdk bootstrap
```

7. `(Optional)`, Run the following command to see the cloud formation template of your cdk code.

```powershell
cdk synth
```

8. `(Optional)`, Run the following command to see the difference between the new changes that you just made and the code that has already been deployed on the cloud.

```powershell
cdk diff
```

9. Deploy, it will just deploy lambda function, use commands,

```powershell
# Build
yarn build

# Deploy
cdk deploy
```

10. Now let's add API Gateways.

```powershell
yarn add @aws-cdk/aws-apigateway
```

11. The following code defines **a REST API that routes all requests** to the specified AWS Lambda function:

```js
declare const backend: lambda.Function;
new apigateway.LambdaRestApi(this, 'myapi', {
  handler: backend,
});
```

- You can also supply `proxy: false`, in which case you will have to **explicitly** define the `API model`:

```js
declare const backend: lambda.Function;
const api = new apigateway.LambdaRestApi(this, 'myapi', {
  handler: backend,
  proxy: false
});

const items = api.root.addResource('items');
items.addMethod('GET');  // GET /items
items.addMethod('POST'); // POST /items

const item = items.addResource('{item}');
item.addMethod('GET');   // GET /items/{item}

// the default integration for methods is "handler", but one can
// customize this behavior per method or even a sub path.
item.addMethod('DELETE', new apigateway.HttpIntegration('http://amazon.com'));
```

12. Deploy, Now it will deploy lambda function with API Gateway so we can integrate with Client side, use same commands,

```powershell
# Build
yarn build

# Deploy
cdk deploy
```

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

The `cdk.json` file tells the CDK Toolkit how to execute your app.
