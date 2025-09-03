import React from "react";
import { Github } from "lucide-react"; // GitHub icon

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENTID;
const GITHUB_REDIRECT = import.meta.env.VITE_GITHUB_REDIRECT;
const GITHUB_SCOPE = "user:email";

export const GitHubLogin: React.FC = () => {
  const handleLogin = () => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT}&scope=${GITHUB_SCOPE}`;
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center gap-2 bg-black w-full text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition duration-200"
    >
      <Github className="w-5 h-5" />
      <span className="font-medium">Login with GitHub</span>
    </button>
  );
};
