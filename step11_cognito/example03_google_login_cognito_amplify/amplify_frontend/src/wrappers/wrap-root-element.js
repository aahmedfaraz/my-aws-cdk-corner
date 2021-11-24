import React from 'react';
import { Amplify } from 'aws-amplify';
import awsmobile from '../aws-exports';
import { AmplifyProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const wrapRootElement = ({ element }) => {
    Amplify.configure(awsmobile);
    return (
        <AmplifyProvider>
            { element }
        </AmplifyProvider>
    )
}

export default wrapRootElement;
