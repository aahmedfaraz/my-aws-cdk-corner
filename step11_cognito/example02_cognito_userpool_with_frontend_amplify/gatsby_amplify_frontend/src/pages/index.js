import React from "react";
import { Authenticator } from '@aws-amplify/ui-react';

// import { Auth } from 'aws-amplify';

const Home = () => {
    // const signup = async () => {
    //     try {
    //       const { user } = await Auth.signUp({
    //           username: 'ahmedfarazNew2',
    //           password: '1234567890Aa.',
    //           attributes: {
    //               email: 'ahmedfaraz838383@gmail.com',
    //               phone_number: '+921234567'
    //           }
    //       });
    //       console.log(user);
    //     } catch (error) {
    //         console.log('error signing up:', error);
    //     }
    // }
    // signup();
  return (
    <Authenticator>
        {({ signOut, user }) => (
            <main>
                <h1>Hello {user.username}</h1>
                <button onClick={signOut}>Sign out</button>
            </main>
        )}
    </Authenticator>
  )
}

export default Home;