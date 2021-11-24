# Steps

1. Created UserPool.
2. Created Google Developer Project.
3. Created UserPool Google Identity Provider and Defined Google Client ID and Secret.
4. Created UserPool Client to use at Client side.

# Cognito Domain

We also need to add a cognito domain which will serve up the login form. It is important to keep track of the domainPrefix that we set here because this is what we will be using in our google developer console. Which will have to be setup before we deploy this Cognito through CDK since it already requires the google console's client ids.

In the dev console you will need to enter:

- **Authorised JavaScript origins:**
  - `https://DOMAIN-PREFIX.auth.eu-west-1.amazoncognito.com`
- **Authorised redirect URIs:**
  - `https://DOMAIN-PREFIX.auth.eu-west-1.amazoncognito.com/oauth2/idpresponse`

```js
const domain = userPool.addDomain("domain", {
  cognitoDomain: {
    domainPrefix: "DOMAIN-PREFIX",
  },
});
```

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
