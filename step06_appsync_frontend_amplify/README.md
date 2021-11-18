# My Amplify Client

<img src="https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step06_appsync_frontend_amplify/assets/client.PNG" alt="client">

# Learnings

- Appsync CDK on Backend ([@aws-cdk/aws-appsync](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-appsync-readme.html))
- Amplify on Frontend ([Amplify Framework Documentation](https://docs.amplify.aws/))

# Connecting to Appsync GraphQL API with AWS Amplify

## Step 1: Preparing Gatsby Frontend

```powershell
gatsby new gatsby-frontend https://github.com/gatsbyjs/gatsby-starter-hello-world
```

## Step 2: Install the Amplify CLI

```powershell
amplify configure
```

## Step 3: Configure Amplify

```powershell
amplify configure
```

## Step 4: Initialize Amplify in your gatsby project. In the root directory of your gatsby project run the following command

```powershell
amplify init
```

## Step 5: Integrate Amplify with your Appsync by running the following command

You can get this id from your AWS Appsync console.

```powershell
amplify add codegen --apiId ENTER_YOUR_API_ID
```

These steps will create a graphql folder and a aws-exports.js file in the src directory of your gatsby project. The graphql folder has all the queries, mutations and subscriptions defined in your schema. The aws-exports.js file has looks like this.

```json
const awsmobile = {
    "aws_project_region": "******ADD YOUR REGION HERE: example (us-east-1) *********",
    "aws_appsync_graphqlEndpoint": "******ADD YOUR GRAPHQL ENDPOINT HERE*********",
    "aws_appsync_region": "******ADD YOUR REGION HERE: example (us-east-1) *********",
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": "********ADD YOUR GRAPHQL API KEY HERE*********"
};

export default awsmobile;
```

## Step 6: Wrap the root element with this client

```js
import React from "react";
import { Amplify } from "aws-amplify";
import awsmobile from "../aws-exports";

export default ({ children }) => {
  Amplify.configure(awsmobile);
  return <div>{children}</div>;
};
```

## Step 7: Export the 'Wrap-root-element' that you made in step 7 from gatsby-browser.js and gatsby-ssr.js files (just like you did in Apollo Client)

## Step 8: Use 'aws-amplify' library to run queries and mutation. Example given below

```js
import { API } from "aws-amplify";

const data = await API.graphql({
  query: addTodo,
  variables: {
    todo: todo,
  },
});
```
