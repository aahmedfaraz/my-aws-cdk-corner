import React from 'react';
import Amplify, {Auth} from 'aws-amplify';
import awsmobile from '../aws-exports';
import { AmplifyProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const wrapRootElement = ({element}) => {

    Amplify.configure(awsmobile);
    Auth.configure();

    return (
        <AmplifyProvider>
            {element}
        </AmplifyProvider>
    )
}

export default wrapRootElement;
