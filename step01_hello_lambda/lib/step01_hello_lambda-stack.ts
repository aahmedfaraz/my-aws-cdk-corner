import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';

export class Step01HelloLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // Defining lambda functions
    // 1 - Hello
    const helloHandler = new lambda.Function(this, "HelloAhmedHandler", {
      runtime: lambda.Runtime.NODEJS_14_X, // Specifying which type of function we have deployed
      code: lambda.Code.fromAsset("lambda"), // 'lambda' is the folder containing all lambda function
      handler: "hello.handler", // 'hello' is the file name and 'handler' is the function name
    })
    // 2 - About
    const aboutHandler = new lambda.Function(this, "AboutAhmedHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "about.handler",
    })

    // Defining API gateways
    // 1 - Hello
    const myLuckyAPI = new apigateway.LambdaRestApi(this, 'myluckyapi', {
      handler: helloHandler,
      proxy: false // to define API Model explicitly (means to define GET, POST etc)
    });
    // 2 - About
    const myAboutAPI = new apigateway.LambdaRestApi(this, 'myaboutapi', {
      handler: aboutHandler,
      proxy: false
    })

    // Defining API Model explicitly
    // 1 - Home
    const hello = myLuckyAPI.root.addResource('hello');
    hello.addMethod('GET'); // GET /hello
    // 2 - About
    const about = myAboutAPI.root.addResource('about');
    about.addMethod('GET'); // GET /about
  }
}
