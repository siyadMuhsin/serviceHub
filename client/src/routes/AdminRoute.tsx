import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./../pages/Admin/Auth/AdminLogin ";
import AdminDashboard from "../pages/Admin/Dashboard/Dashboard";
import { AdminProtectRoute, AdminLoginRoute } from "./ProtectRoute";
import AdminAuthCheck from "../CostomHooks/AdminAuthCheck";

const AdminRoute = () => {
  const loading = AdminAuthCheck()

  if(loading){
    return <h2>Loading...</h2>
  }
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AdminLoginRoute>
            <AdminLogin />
          </AdminLoginRoute>
        }
      />
      <Route element={<AdminProtectRoute />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRoute;
