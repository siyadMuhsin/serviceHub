import React, { useEffect, useState } from "react";
import "./Login.css";
import { FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signUpStart,
  signUpSuccess,
  signUpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../../Slice/authSlice";
import { RootState, AppDispatch } from "../../../store";
import {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  googleSignIn
} from "../../../services/User/AuthServices";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, otpSent, otpVerified,isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState<number>(0);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
const [googleUser,setGoogleUser]=useState<object |null >(null)
  useEffect(() => {
    const container = document.getElementById("container");
    if (container) {
      setTimeout(() => {
        container.classList.add("sign-in");
      }, 200);
    }
  }, []);

  useEffect(() => {
    let interval: number | void ; // Use `number` for browser environment
    const storedTimerEnd = localStorage.getItem("otpTimerEnd");
    if (storedTimerEnd) {
      const timerEnd = parseInt(storedTimerEnd, 10);
      const now = Date.now();
      const remainingTime = Math.max(0, Math.floor((timerEnd - now) / 1000));

      if (remainingTime > 0) {
        setTimer(remainingTime);
        setIsResendDisabled(true);
        interval = startTimer(timerEnd);
      }
    }

    return () => {
      if (interval) clearInterval(interval); // Clear the interval on unmount
    };
  }, []);

  const startTimer = (timerEnd: number) => {
    const interval = setInterval(() => {
      const now = Date.now();
      const remainingTime = Math.max(0, Math.floor((timerEnd - now) / 1000));

      setTimer(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(interval);
        localStorage.removeItem("otpTimerEnd");
        setIsResendDisabled(false);
      }
    }, 1000);

    return interval; // Return the interval ID
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp(formData.email);
      if (response.success) {
        toast.success("OTP resent successfully!");
        const timerEnd = new Date().getTime() + 60000;
        localStorage.setItem("otpTimerEnd", timerEnd.toString());
        setTimer(30);
        setIsResendDisabled(true);
        startTimer(timerEnd);
      } else {
        toast.error(response.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while resending OTP");
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp((prev) => !prev);
    const container = document.getElementById("container");
    if (container) {
      container.classList.toggle("sign-in");
      container.classList.toggle("sign-up");
    }
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      try {
        dispatch(signUpStart());

        const response = await registerUser(formData);
        if (response.success) {
          dispatch(signUpSuccess(response));
          toast.success(
            response.message ||
              "Sign-up successful! Please verify OTP sent to your email."
          );

          const getTimer = localStorage.getItem("otpTimerEnd");
          if (getTimer) {
            const timerEnd = parseInt(getTimer, 10);
            const now = new Date().getTime();
            const remainingTime = Math.max(
              0,
              Math.floor((timerEnd - now) / 1000)
            );

            if (remainingTime > 0) {
              setTimer(remainingTime);
              setIsResendDisabled(true);
              startTimer(timerEnd);
            } else {
              localStorage.removeItem("otpTimerEnd");
              setIsResendDisabled(false);
            }
          } else {
            const timerEnd = new Date().getTime() + 60000; // 60 seconds
            localStorage.setItem("otpTimerEnd", timerEnd.toString());
            setTimer(60); // Set timer to 60 seconds
            setIsResendDisabled(true);
            startTimer(timerEnd);
          }
        } else {
          dispatch(signUpFailure(response.message || "Sign-up failed"));
          toast.error(response.message || "Sign-up failed");
        }
      } catch (error: any) {
        dispatch(signUpFailure(error.message || "An error occurred"));
        toast.error(error.message || "An error occurred during registration");
      }
    } else {
      dispatch(loginStart());
      const response = await loginUser(formData.email, formData.password);

      try {
        if (response?.success) {
          dispatch(loginSuccess(response));
          toast.success("Login successful!");
          navigate("/");
        } else {
          dispatch(loginFailure(response.message || "Login failed")); 
          toast.error(response.message || "Login failed. Please try again.");
        }
      } catch (err: any) {
        dispatch(loginFailure(err.message || "An error occurred"));
        toast.error(err.message || "An error occurred during login");
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(verifyOtpStart());
      const response = await verifyOtp(otp, formData.email);
      if (response.success) {
        dispatch(verifyOtpSuccess(response));
        toast.success("OTP verified successfully!");
        if (response.success) {
          toggleAuthMode();
        }
      } else {
        dispatch(
          verifyOtpFailure(response.message || "OTP verification failed")
        );
        toast.error(response.message || "OTP verification failed");
      }
    } catch (error: any) {
      dispatch(verifyOtpFailure(error.message || "An error occurred"));
      toast.error(error.message || "An error occurred during OTP verification");
    }
  };

const handleGoogleSignIn = useGoogleLogin({
      onSuccess: (codeResponse) => setGoogleUser(codeResponse),
      onError: (error) => {
        console.log("Google error:", error);
      },
      flow:'implicit'
    });
    useEffect(() => {
      const getData = async () => {
        if (googleUser && googleUser.access_token) {
          
          try {
            const response=await googleSignIn(googleUser);
            if(response.success){
              toast.success('login successfully')
              dispatch(loginSuccess(response))
            }
            
          } catch (error) {
            console.error("Google Sign-In API Error:", error);
          }
        }
      };
      getData();
    }, [googleUser]);
  return (
    <div id="container" className="container">
      <div className="row">
        {/* SIGN UP */}
        <div className="col align-items-center flex-col sign-up">
          <div className="form-wrapper align-items-center">
            {!otpSent ? (
              <form className="form sign-up" onSubmit={handleSubmit}>
                <div className="input-group">
                  <i className="bx bxs-user"></i>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <i className="bx bx-mail-send"></i>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <i className="bx bxs-lock-alt"></i>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <i className="bx bxs-lock-alt"></i>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button className="action" type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Sign up"}
                </button>
                <button
                  className="google-btn"
                  type="button"
                  onClick={handleGoogleSignIn}
                >
                  <FaGoogle className="google-icon" /> Sign up with Google
                </button>

                <p>
                  <span>Already have an account?</span>
                  <b onClick={toggleAuthMode} className="pointer">
                    Sign in here
                  </b>
                </p>
              
              </form>
            ) : (
              <form className="form sign-up" onSubmit={handleOtpSubmit}>
                <div className="input-group">
                  <i className="bx bxs-lock-alt"></i>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <button className="action" type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Verify OTP"}
                </button>
                <div className="otp-timer">
                  {timer > 0 ? (
                    <p>Time remaining: {timer} seconds</p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResendDisabled}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        {/* SIGN IN */}
        <div className="col align-items-center flex-col sign-in">
          <div className="form-wrapper align-items-center">
            <form className="form sign-in" onSubmit={handleSubmit}>
              <div className="input-group">
                <i className="bx bxs-user"></i>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button className="action" type="submit" disabled={loading}>
                {loading ? "Loading..." : "Sign In"}
              </button>
              <button
                className="google-btn"
                type="button"
                onClick={handleGoogleSignIn}
              >
                <FaGoogle className="google-icon" /> Sign in with Google
              </button>
              <p>
                <b onClick={()=>navigate('/forget-password')} className="cursor-pointer">Forgot password?</b>
              </p>
              <p>
                <span>Don't have an account?</span>
                <b onClick={toggleAuthMode} className="pointer">
                  Sign up here
                </b>
              </p>
              <p>
                  <span>Are you a Service Expert? </span>
                  <b onClick={() => navigate('/expert/auth')} className="pointer">
                    login here
                  </b>
                </p>
            </form>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="row content-row">
        {/* SIGN IN CONTENT */}
        <div className="col align-items-center flex-col">
          <div className="text sign-in">
            <h2>Welcome</h2>
            <p>Sign in to continue</p>
          </div>
        </div>

        {/* SIGN UP CONTENT */}
        <div className="col align-items-center flex-col">
          <div className="text sign-up">
            <h2>Join with us</h2>
            <p>Create an account to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
