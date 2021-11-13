# 1. Getting Initial Boilerplate

```powershell
# For CDK Backend
cdk init app --language typescript

# For React Frontend
npx create-react-app . --template typescript
```

# 2. Installing Dependencies

### For React Frontend

- `@apollo/client`: This single package contains virtually everything you need to set up Apollo Client. It includes the in-memory cache, local state management, error handling, and a React-based view layer.
- `graphql`: This package provides logic for parsing GraphQL queries.

### For CDK Backend

- [@aws-cdk/aws-appsync](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-appsync-readme.html)
- [@aws-cdk/aws-lambda](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html)
- [@aws-cdk/aws-dynamodb](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-dynamodb-readme.html)

```powershell
# For CDK Backend
npm install @aws-cdk/aws-appsync @aws-cdk/aws-lambda @aws-cdk/aws-dynamodb

# For React Frontend
yarn add @apollo/client graphql
```
