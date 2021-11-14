### Presentation of My Appsyn Backend and Apollo Frontend

# On Appsync GraphQL

#### Calling for simple `welcome` message and `products`(empty)

- Appsyn View
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/graphql1.PNG' alt='pic'>

#### Adding a product `Sugar : $30`

- Appsync View
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/graphql2.PNG' alt='pic'>

#### After adding two products (`Sugar : $30` & `Milk : $20`)

- Appsync View
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/graphql3.PNG' alt='pic'>
- Dynamo View
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/dynamo1.PNG' alt='pic'>

#### Updating `Milk : $20` into `Sandwitch : $20`

- Appsync View
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/graphql4.PNG' alt='pic'>
- Dynamo View
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/dynamo2.PNG' alt='pic'>

#### Deleting `Sandwitch : $20`

- Appsnc View
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/graphql5.PNG' alt='pic'>
- Dynamo View
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/dynamo3.PNG' alt='pic'>

# On Gatsby Apollo Frontend

#### Simple View

  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/apollo1.PNG' alt='pic'>

#### After Calling for `welcome` message and `products` list

- Only last remained product `Sugar : $30` will be shown.

  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/apollo2.PNG' alt='pic'>

#### Adding new Product `Cream : $20`

- Before Adding

  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/apollo3.PNG' alt='pic'>

- After Additing
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/apollo4.PNG' alt='pic'>

#### Updating `Sugar : $30` into `Sugarcane : $100`

- Selected Product
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/apollo5.PNG' alt='pic'>
- Provided new information, then hit **Update** button on Form
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/apollo6.PNG' alt='pic'>
- Finally Updated
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/apollo7.PNG' alt='pic'>

#### Deleting `Sugarcane : $100`

- Before clicking `Delete` button
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/apollo7.PNG' alt='pic'>
- After Deleting
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/apollo8.PNG' alt='pic'>

#### Again Dynamo View in the end

- Only the remaining product is present, `Cream : $20`
  <img src='https://github.com/aahmedfaraz/my-aws-cdk-corner/blob/main/step05_appsync_gatsby_client/assets/dynamo4.PNG' alt='pic'>
