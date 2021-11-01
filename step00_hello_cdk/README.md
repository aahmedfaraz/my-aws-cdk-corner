# My Steps for Hello CDK

1. Create an AWS Account.
2. Create IAM User and Note down it's `user access id` & `secret access key`.
3. Download and Install **`AWS CLI`** from [Here](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).
4. Install **NPM** packages `typescript` & `aws-cdk` **globally** using commands,

```powershell
# Install Typescript globally
npm -g install typescript

# Install AWS-CDK globally
npm -g install aws-cdk

# Ensure Installation
cdk --version
```

5. Create a Folder and Open it in your favourite Code Editor and initialize CDK App to get Basic boilerplate using command,

```powershell
# Initialize CDK boilerplate for Template app (If you don't specify a template, the default is "app,")
cdk init app --language typescript
```

# About CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
