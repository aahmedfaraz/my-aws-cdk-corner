import React from 'react';
// import React, { useEffect, useState } from 'react';
// import { Auth, Hub } from 'aws-amplify';
import { Authenticator, View, Heading, Text, useTheme } from '@aws-amplify/ui-react';

const components = {
  Header() {
    const { tokens } = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.small}>
        <Heading fontSize="larger">Developed By Ahmed Faraz</Heading>
      </View>
    );
  },

  Footer() {
    const { tokens } = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.medium}>
        <Text color={`${tokens.colors.neutral['80']}`}>
          &copy; All Rights Reserved
        </Text>
      </View>
    );
  },
}

function App() {
  // const [user, setUser] = useState(null);
  // useEffect(() => {
  //   Hub.listen('auth', ({ payload: { event, data } }) => {
  //     switch (event) {
  //       case 'signIn':
  //       case 'cognitoHostedUI':
  //         getUser().then(userData => setUser(userData));
  //         break;
  //       case 'signOut':
  //         setUser(null);
  //         break;
  //       case 'signIn_failure':
  //       case 'cognitoHostedUI_failure':
  //         console.log('Sign in failure', data);
  //         break;
  //     }
  //   });

  //   getUser().then(userData => { setUser(userData); console.log("Signed In:", userData) });
  // }, []);

  // function getUser() {
  //   return Auth.currentAuthenticatedUser()
  //     .then(userData => userData)
  //     .catch(() => console.log('Not signed in'));
  // }

  return (
    // <main style={{ display: "grid", placeItems: "center", height: "100%" }}>

    //   {user ? (
    //     <div>
    //       <button onClick={() => Auth.signOut()}><h1>Sign out</h1></button>
    //       <h1>{user.username}</h1>
    //     </div>
    //   ) : (
    //       <div>
    //         <h1>No User Logged In.</h1>
    //         <button onClick={() => Auth.federatedSignIn({ provider: "Google" })}>Sign In with Google</button>
    //       </div>
    //     )}
    // </main>
    <Authenticator loginMechanisms={['email']} socialProviders={['google']} variation="modal" components={components}>
      {({ signOut, user }) => {
        console.log('User', user);
        return (
          <main>
            <h1>Hello {user.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )
      }}
    </Authenticator>
  );
}

export default App;