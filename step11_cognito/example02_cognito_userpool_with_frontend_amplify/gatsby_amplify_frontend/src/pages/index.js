import React from "react";
import { Authenticator } from '@aws-amplify/ui-react';
import '../styles/global.css';

const Home = () => {
  return (
    <Authenticator>
        {({ signOut, user }) => (
            <main>
                <h1>Hello <span>{user.username}</span></h1>
                <button onClick={signOut}>Sign out</button>
            </main>
        )}
    </Authenticator>
  )
}

export default Home;