import { Routes, Route } from "react-router-dom";
import Login from "../pages/User/Auth/Login";
import ForgetPassword from "../pages/User/Auth/ForgetPasword";
import ResetPassword from "../pages/User/Auth/ResetPassword";
import Landing from "../pages/User/Home/Landing";
import Category from "../pages/User/Category";
import Service from "../pages/User/Service";
import Profile from "../pages/User/Home/Profile";
import NotFound from "../pages/User/NotFount";
import Loading from "@/components/Loading";
import useAuthCheck from "../CostomHooks/useAuthCheck ";
import { PublicLayout, PrivateLayout } from "../layout/user.layoute";
import { LoginRoute } from "./ProtectRoute";

const AppRoutes = () => {
  const loading = useAuthCheck();

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      {/* Public Routes (No Navbar & Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginRoute><Login /></LoginRoute>} />
        <Route path="/forget_password" element={<LoginRoute><ForgetPassword /></LoginRoute>} />
        <Route path="/reset-password/:token" element={ <LoginRoute > <ResetPassword /> </LoginRoute>} />
      </Route>

      {/* Private Routes (With Navbar & Footer) */}
      <Route element={<PrivateLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/categories/:id" element={<Service />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
