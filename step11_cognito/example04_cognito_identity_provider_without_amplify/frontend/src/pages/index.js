import React from 'react'
import config from '../config';

const Home = ({ location }) => {

  console.log(location);

  const { domainUrl, clientId, loginRedirectUri } = config;

  return (
    <div>
      Welcome to the app
      <button onClick={() => {
          window.location.href = `${domainUrl}/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${loginRedirectUri}`
        }}>Login or Sign Up</button>
    </div>
  )
}

export default Home;