# Steps to Setup Gatsby Apollo Client

1. Create a `Gatsby` project using `hello-world starter`

```powershell
# Initializing Gatsby Project using starter hello-world
gatsby new gatsby-apollo-frontend https://github.com/gatsbyjs/gatsby-starter-hello-world
```

2. Install Plugin for `@apollo/client`, [Read Docs](https://www.gatsbyjs.com/plugins/gatsby-plugin-apollo/)

```powershell
npm install gatsby-plugin-apollo @apollo/client
```

3. Add the plugin to your Gatsby config `gatsby-config.js`, and supply the location of your desired GraphQL API to the `uri` option

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-apollo",
      options: {
        uri: process.env.GATSBY_APPSYNC_GRAPHQL_API_URL,
        headers: {
          "x-api-key": process.env.APPSYNC_GRAPHQL_API_KEY,
        },
      },
    },
  ],
}
```

4. Use like shown below

- For type `Query` queries

```js
import React from "react"
import { useQuery, gql } from "@apollo/client"

const QUERY_WELCOME = gql`
  query MyQuery {
    welcome
  }
`

const Welcome = () => {
  const { loading, error, data } = useQuery(QUERY_WELCOME)

  return (
    <p className="welcome">
      {loading
        ? "Loading..."
        : error
        ? "Error Occured..."
        : data && data.welcome}
    </p>
  )
}

export default Welcome
```

- For type `Mutation` queries

```js
import React from "react"
import { useMutation, gql } from "@apollo/client"

const MUTATION_ADD_PRODUCT = gql`
  mutation MyMutation($newProduct: AddProductInput) {
    addProduct(product: $newProduct) {
      id
      price
      title
    }
  }
`

const Component = () => {
    const [myMutateFuncAddProduct, { loading, error, data }] = useQuery(MUTATION_ADD_PRODUCT);

    const addProduct = asycn (product) => {
        const addedProduct = await myMutateFuncAddProduct({
            variables: {
                newProduct: product
            }
        })

        return addedProduct;
    }

    return (
        // ...
    )
}

export default Component;
```

# Extras

- Environment Variables using `dotenv`, [Read about dotenv inside Gatsby Docs for more details](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/)
