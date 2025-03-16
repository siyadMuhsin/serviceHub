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
import Loading from "@/components/Loading";
const AppRoutes = () => {
  const loading = useAuthCheck();

  if (loading) {
    return <Loading/>
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

     
      {/* Protect all other user routes */}
      <ProtectedRoute>
      <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/categories" element={<Category/>} />
          <Route path="/categories/:id" element={<Service/>} />
        </Routes>
        <Footer />
      </ProtectedRoute>
     
    </>
  );
};

export default AppRoutes;