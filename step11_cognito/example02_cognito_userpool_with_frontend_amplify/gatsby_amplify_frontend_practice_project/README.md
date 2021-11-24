# Commands I used

```powershell
# Step 01
gatsby new . https://github.com/gatsbyjs/gatsby-starter-hello-world
# Step 02
amplify init
# Step 03
amplify add auth #And gone for default configurations
# Step 04
amplify push
# Step 05
npm install aws-amplify @aws-amplify/ui-react
# Step 06
## CREATED wrap-root-element.js aws-export.js gatsby-browser.js gatsby-ssr.js index.js
# Step 07
amplify pull
# Step 08
# Step 09
```

# wrap-root-element.js

```js
import React from "react"
import Amplify, { Auth } from "aws-amplify"
import awsmobile from "../aws-exports"
import { AmplifyProvider } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"

const wrapRootElement = ({ element }) => {
  Amplify.configure(awsmobile) // <------------------------ IMPORTANT
  Auth.configure() // <------------------------------------ IMPORTANT

  return <AmplifyProvider>{element}</AmplifyProvider>
}

export default wrapRootElement
```
