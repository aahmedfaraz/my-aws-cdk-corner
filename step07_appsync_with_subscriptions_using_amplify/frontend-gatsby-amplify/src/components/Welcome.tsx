import React, { useState, Fragment } from 'react';
import { API } from 'aws-amplify';
import { welcome } from '../graphql/queries';

const Welcome = () => {

    const [message, setMessage] = useState('Your Message will be shown here')

    const getMessage = async () => {
        setMessage('Loading...');
        try {
            const res : any = await API.graphql({
                query: welcome
            });
            setMessage(res.data.welcome);
        } catch (err) {
            console.log('Error', err);
            setMessage('Something went wrong, Error occured');
        }
    }

    return (
        <Fragment>
            <button onClick={getMessage}>GET Welcome Message</button>
            <p className="welcome">{message}</p>
        </Fragment>
    )
}

export default Welcome;