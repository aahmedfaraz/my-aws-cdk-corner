import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_WELCOME } from '../queries';

const Welcome = () => {

    const { loading, error, data } = useQuery(QUERY_WELCOME);

    return (
        <p className="welcome">
          {
            loading ? 'Loading...' : error ? 'Error Occured...' : data && data.welcome
          }
        </p>
    )
}

export default Welcome;