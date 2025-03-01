import { Routes, Route } from "react-router-dom";
import Login from "../pages/User/Auth/Login";
import Landing from "../pages/User/Home/Landing";
import { ProtectedRoute, LoginRoute } from "./ProtectRoute";
import ForgetPasword from "../pages/User/Auth/ForgetPasword";
import ResetPassword from "../pages/User/Auth/ResetPassword";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginRoute>
            <Login />
          </LoginRoute>
        }
      />
      <Route
        path="/forget-password"
        element={
          <LoginRoute>
            <ForgetPasword />
          </LoginRoute>
        }
      ></Route>
      <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Landing />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
