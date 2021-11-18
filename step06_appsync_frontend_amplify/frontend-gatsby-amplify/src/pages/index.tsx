import React, { Fragment } from "react";
import '../css/style.css';

import Welcome from "../components/Welcome";
import Products from "../components/Products";

const Home = () => {
  return (
    <Fragment>
      <title>CDK | Ahmed Faraz</title>
      <h1 className="nav-heading">Ahmed Faraz<br /><small>CDK-Appsync-Dynamo + Gatsby-Amplify-Client</small></h1>
      <main>
        <Welcome />
        <Products />
      </main>
    </Fragment>
  )
}

export default Home;
