import React from 'react';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { AmplifyProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const wrapRootElement = ({ elements }) => {

    Amplify.configure(awsconfig);

    // You can get the current config object
    const currentConfig = Auth.configure();

    console.log('currentConfig', currentConfig);

    return (
        <AmplifyProvider>
            { elements }
        </AmplifyProvider>
    )
}

export default wrapRootElement;
