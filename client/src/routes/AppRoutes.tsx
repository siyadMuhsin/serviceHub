import { Routes, Route } from "react-router-dom";
import Login from "../pages/User/Auth/Login";
import Landing from "../pages/User/Home/Landing";
import { ProtectedRoute, LoginRoute } from "./ProtectRoute";
import ForgetPasword from "../pages/User/Auth/ForgetPasword";
import ResetPassword from "../pages/User/Auth/ResetPassword";
import useAuthCheck from "../CostomHooks/useAuthCheck ";
import Navbar from "../components/User/Navbar";
import Footer from "../components/User/Footer";
import Category from "../pages/User/Category";
import Service from "../pages/User/Service";

const AppRoutes = () => {
  const loading = useAuthCheck();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Routes>
        {/* Auth-related routes */}
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
        />
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />
      </Routes>

      <Navbar />
      {/* Protect all other user routes */}
      <ProtectedRoute>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/categories" element={<Category/>} />
          <Route path="/categories/:id" element={<Service/>} />
        </Routes>
      </ProtectedRoute>
      <Footer />
    </>
  );
};

export default AppRoutes;
