import React, { useState, useEffect } from "react"
import config from "../config";

const Dashboard = ({ location }) => {
    
    const queryParam = location.search

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const code = queryParam.substring(6);

    console.log('Code', code);
    console.log('location', location);

    useEffect(() => {
        const storedToken = sessionStorage.getItem("access_token")
        if (storedToken) {
            fetchUserDetails(storedToken)
        } else {
            fetchTokens()
        }
    }, [])

    const fetchTokens = async () => {
        //  Encrypted client id:secret
        const authData = btoa(`${config.clientId}:${config.clientSecret}`)

        // Used inside request options with Auth Data (Encrypted)
        const requestOptions = {
            method: "POST",
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${authData}`,
            },
        }

        try {
            setLoading(true);
            // POST request over URL `${config.domainUrl}/oauth2/token?grant_type=${config.grant_type}&code=${code}&client_id=${config.clientId}&redirect_uri=${config.loginRedirectUri}
            const res = await fetch(`${config.domainUrl}/oauth2/token?grant_type=${config.grant_type}&code=${code}&client_id=${config.clientId}&redirect_uri=${config.loginRedirectUri}`,requestOptions)
            const data = await res.json();
            console.log('Fetch Token Data', data);
            sessionStorage.setItem("access_token", data.access_token)
            fetchUserDetails(data.access_token)
        } catch (err) {
            console.log('Fetch Token Error', err);
        }
    }
    
    const fetchUserDetails = async (accessToken) => {
        //   request options with Access Token
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        setLoading(true);
        try {
            // POST request to get user info using the recieved access_token
            const res = await fetch(`${config.domainUrl}/oauth2/userInfo`, requestOptions);
            const data = await res.json();
            console.log('Fetch User Details Data', data);
            if(data.username){
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.log('Fetch User Details Error', err);
        }
        setLoading(false);
    }

    const logout = () => {
        window.location.href = `${config.domainUrl}/logout?client_id=${config.clientId}&logout_uri=${config.logoutUri}`;
        sessionStorage.removeItem("access_token");
    }

  return (
    <div>
        {
            loading ? (
                <h2>Loading...</h2>
            ) : (!loading && !user) ? (
                <h2>Something went wrong!</h2>
            ) : (
                <>
                    <h2>You are logged in as : {user.username}</h2>
                    <button onClick={() => logout()}>Logout</button>
                </>
            )
        }
    </div>
  )
}

export default Dashboard;