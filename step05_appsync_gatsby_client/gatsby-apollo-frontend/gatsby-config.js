require("dotenv").config({
  path: `.env`,
})

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-apollo',
      options: {
        uri: process.env.GATSBY_APPSYNC_GRAPHQL_API_URL,
        headers: {
          'x-api-key': process.env.APPSYNC_GRAPHQL_API_KEY
        }
      }
    }
  ]
}