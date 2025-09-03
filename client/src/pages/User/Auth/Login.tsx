import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
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
import validation from "../../../validations/formValidation";
import {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  googleSignIn
} from "../../../services/User/AuthServices";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import { GitHubLogin } from "@/components/User/GithubLogin";

// Type definitions
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface GoogleUser {
  access_token?: string;
  [key: string]: any;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, otpSent, otpVerified, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  useEffect(() => {
    const container = document.getElementById("container");
    if (container) {
      setTimeout(() => {
        container.classList.add(styles.signIn);
      }, 200);
    }
  }, []);

  useEffect(() => {
    let interval: number | NodeJS.Timeout; // Use proper type for both browser and Node environments
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

  const startTimer = (timerEnd: number): NodeJS.Timeout => {
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

  const handleResendOtp = async (): Promise<void> => {
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
    } catch (error) {
      toast.error(error.message || "An error occurred while resending OTP");
    }
  };

  const toggleAuthMode = (): void => {
    setIsSignUp((prev) => !prev);
    const container = document.getElementById("container");
    if (container) {
      container.classList.toggle(styles.signIn);
      container.classList.toggle(styles.signUp);
    }
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      const checkValid = validation(formData);
      if (!checkValid) return;
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
      } catch (error) {
        dispatch(signUpFailure(error.message || "An error occurred"));
        toast.error(error.message || "An error occurred during registration");
      }
    } else {
      const checkValid = validation({email: formData.email, password: formData.password});
      if (!checkValid) return;
      dispatch(loginStart());

      try {
        const response = await loginUser(formData.email, formData.password);

        if (response?.success) {
          dispatch(loginSuccess(response));
          toast.success("Login successful!");
          navigate("/");
        } else {
          dispatch(loginFailure(response.message || "Login failed")); 
          toast.error(response.message || "Login failed. Please try again.");
        }
      } catch (err) {
        dispatch(loginFailure(err.message || "An error occurred"));
        toast.error(err.message || "An error occurred during login");
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent): Promise<void> => {
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
    } catch (error) {
      dispatch(verifyOtpFailure(error.message || "An error occurred"));
      toast.error(error.message || "An error occurred during OTP verification");
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: (codeResponse) => setGoogleUser(codeResponse),
    onError: (error) => {
      console.log("Google error:", error);
    },
    flow: 'implicit'
  });
  
  useEffect(() => {
    const getData = async () => {
      if (googleUser && googleUser.access_token) {
        try {
          const response = await googleSignIn(googleUser);
          if (response.success) {
            toast.success('Login successfully');
            dispatch(loginSuccess(response));
            navigate("/");
          }else{
            toast.error(response.messagen ||"Failed to login")
            
          }
        } catch (error) {
          console.error("Google Sign-In API Error:", error);
          toast.error(error.message || 'Internal server error')
        }
      }
    };
    getData();
  }, [googleUser, dispatch, navigate]);

  return (
    <div id="container" className={styles.container}>
      <div className={styles.row}>
        {/* SIGN UP */}
        <div className={`${styles.col} ${styles.alignItemsCenter} ${styles.flexCol} ${styles.signUp}`}>
          <div className={`${styles.formWrapper} ${styles.alignItemsCenter}`}>
            {!otpSent ? (
              <form className={`${styles.form} ${styles.signUp}`} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
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
                <div className={styles.inputGroup}>
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
                <div className={styles.inputGroup}>
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
                <div className={styles.inputGroup}>
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
                <button className={styles.action} type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Sign up"}
                </button>
                <button
                  className={styles.googleBtn}
                  type="button"
                  onClick={() => handleGoogleSignIn()}
                >
                  <FaGoogle className={styles.googleIcon} /> Sign up with Google
                </button>

                <p>
                  <span>Already have an account?</span>
                  <b onClick={toggleAuthMode} className={styles.pointer}>
                    Sign in here
                  </b>
                </p>
              </form>
            ) : (
              <form className={`${styles.form} ${styles.signUp}`} onSubmit={handleOtpSubmit}>
               <div className={styles.inputGroup}>
  <i className="bx bxs-lock-alt"></i>
  <input
    type="text"
    placeholder="Enter OTP"
    value={otp}
    onChange={(e) => {
      const value = e.target.value;
      if (/^\d{0,4}$/.test(value)) {
        setOtp(value);
      }
    }}
    maxLength={4}
    required
  />
</div>
                <button className={styles.action} type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Verify OTP"}
                </button>
                <div className={styles.otpTimer}>
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
        <div className={`${styles.col} ${styles.alignItemsCenter} ${styles.flexCol} ${styles.signIn}`}>
          <div className={`${styles.formWrapper} ${styles.alignItemsCenter}`}>
            <form className={`${styles.form} ${styles.signIn}`} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
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
              <div className={styles.inputGroup}>
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
              <button className={styles.action} type="submit" disabled={loading}>
                {loading ? "Loading..." : "Sign In"}
              </button>
              <button
                className={styles.googleBtn}
                type="button"
                onClick={() => handleGoogleSignIn()}
              >
                <FaGoogle className={styles.googleIcon} /> Sign in with Google
              </button>
              <GitHubLogin/>
              <p>
                <b onClick={() => navigate('/forget_password')} className={styles.cursorPointer}>
                  Forgot password?
                </b>
              </p>
              <p>
                <span>Don't have an account?</span>
                <b onClick={toggleAuthMode} className={styles.pointer}>
                  Sign up here
                </b>
              </p>
              {/* <p>
                <span>Are you a Service Expert? </span>
                <b onClick={() => navigate('/expert/auth')} className={styles.pointer}>
                  login here
                </b>
              </p> */}
            </form>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className={`${styles.row} ${styles.contentRow}`}>
        {/* SIGN IN CONTENT */}
        <div className={`${styles.col} ${styles.alignItemsCenter} ${styles.flexCol}`}>
          <div className={`${styles.text} ${styles.signIn}`}>
            <h2>Welcome</h2>
            <p>Sign in to continue</p>
          </div>
        </div>

        {/* SIGN UP CONTENT */}
        <div className={`${styles.col} ${styles.alignItemsCenter} ${styles.flexCol}`}>
          <div className={`${styles.text} ${styles.signUp}`}>
            <h2>Join with us</h2>
            <p>Create an account to get started</p>
            </div>
            </div>
            </div>
            </div>
  )}

export default Login