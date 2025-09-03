import React from "react";

const GITHUB_CLIENT_ID=import.meta.env.VITE_GITHUB_CLIENTID
const GITHUB_REDIRECT=import.meta.env.VITE_GITHUB_REDIRECT
const GITHUB_SCOPE='user:email'

export const GitHubLogin:React.FC=()=>{
    const handleLogin=()=>{
        const authUrl=`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT}&scope=${GITHUB_SCOPE}`
        window.location.href=authUrl
    }

    return (
        <button onClick={handleLogin}>
            Login with GitHub
        </button>
    )

}