import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/Admin/Auth/AdminLogin ";
import AdminDashboard from "../pages/Admin/Dashboard/Dashboard";
import { AdminProtectRoute, AdminLoginRoute } from "./Protect.routes";
import AdminAuthCheck from "../CostomHooks/AdminAuthCheck";
import Category from "../pages/Admin/Category";
import Services from "../pages/Admin/Services";
import UserManagement from "../pages/Admin/UserManagment";
import ExpertMangement from "../pages/Admin/ExpertMangement";
import ExpertDetailsPage from "../pages/Admin/ExpertDetailsPage";
import Subscriptoin from "@/pages/Admin/Subscriptoin";

const AdminRoute = () => {
  const loading = AdminAuthCheck();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Routes>
      {/* Public login route */}
      <Route
        path="/login"
        element={
          <AdminLoginRoute>
            <AdminLogin />
          </AdminLoginRoute>
        }
      />

      {/* Protected routes group */}
      <Route element={<AdminProtectRoute />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/services" element={<Services />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/experts" element={<ExpertMangement />} />
        <Route path="/expert/:id" element={<ExpertDetailsPage />} />
        <Route path="/subscription" element={<Subscriptoin />} />
      </Route>
    </Routes>
  );
};

export default AdminRoute;
