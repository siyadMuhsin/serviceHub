// src/pages/GitHubCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginSuccess } from "@/Slice/authSlice";
import { github_login } from "@/services/User/AuthServices";

export const GitHubCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGitHubLogin = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
          const result = await github_login(code);

          // save to redux
          dispatch(loginSuccess(result));

          toast.success("Login successfully");

          // redirect to home/dashboard
          navigate("/");
        } else {
          toast.error("No authorization code found");
          navigate("/login");
        }
      } catch (err) {
        console.error("GitHub login failed", err);
        toast.error("GitHub login failed");
        navigate("/login");
      }
    };

    handleGitHubLogin();
  }, [dispatch, navigate]);

  return <p>Signing you in with GitHub...</p>;
};
