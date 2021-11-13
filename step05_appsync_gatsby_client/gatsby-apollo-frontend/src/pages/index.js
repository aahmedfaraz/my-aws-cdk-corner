import React, { useState } from "react";
import Welcome from "../components/Welcome";
import Products from "../components/Products";

import '../css/style.css';

const Home = () => {

  const [showMessage, setShowMessage] = useState(false)
  const [showProducts, setShowProducts] = useState(false)

  return (
    <>
      <title>CDK | Ahmed Faraz</title>
      <h1 className="nav-heading">Ahmed Faraz<br /><small>CDK-Appsync-Dynamo + Gatsby-Apollo</small></h1>
      <main>
        <button onClick={() => setShowMessage(true)}>GET Welcome Message</button>
        {
          showMessage ? <Welcome /> : <p>Your message will display here</p>
        }
        <button onClick={() => setShowProducts(true)}>GET All Products</button>
        {
          showProducts ? <Products /> : <p>Your products will display Here</p>
        }
      </main>
    </>
  )
}

export default Home;