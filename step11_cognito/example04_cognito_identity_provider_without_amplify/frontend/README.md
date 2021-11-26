# Login Uri

```js
;`${domainUrl}/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${loginRedirectUri}`
```

# Logout Uri

```js
;`${domainUrl}/logout?client_id=${clientId}&logout_uri=${logoutUri}`
```

# Fetch Token URL

```js
// Request Options
//  [Encrypted client id:secret]
const authData = btoa(`${config.clientId}:${config.clientSecret}`)
// [Used inside request options with Auth Data (Encrypted)]
const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${authData}`,
  },
} // URL
`${config.domainUrl}/oauth2/token?grant_type=${config.grant_type}&code=${code}&client_id=${config.clientId}&redirect_uri=${config.loginRedirectUri}`
```

# Fetch User Details URL

```js
//   Request options with Access Token
const requestOptions = {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
}// URL
`${config.domainUrl}/oauth2/userInfo`
```
