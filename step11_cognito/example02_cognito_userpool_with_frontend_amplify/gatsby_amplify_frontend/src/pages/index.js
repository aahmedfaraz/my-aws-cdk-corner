import React from "react";
import { Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

export default async function Home() {
  try {
    const { user } = await Auth.signUp({
        username: 'ahmedfaraz',
        password: '1234567890Aa.',
        attributes: {
            email: 'ahmedfaraz838383@gmail.com'
        }
    });
    console.log(user);
  } catch (error) {
      console.log('error signing up:', error);
  }
  return (
    <Authenticator loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <main>
          <h1>Hello Cheety {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  )
}
