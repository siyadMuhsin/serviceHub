import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./../pages/Admin/Auth/AdminLogin ";
import AdminDashboard from "../pages/Admin/Dashboard/Dashboard";
import { AdminProtectRoute, AdminLoginRoute } from "./ProtectRoute";
import AdminAuthCheck from "../CostomHooks/AdminAuthCheck";
import Category from "../pages/Admin/Category";
import Services from "../pages/Admin/Services";
import UserManagement from "../pages/Admin/UserManagment";
import ExpertMangement from "../pages/Admin/ExpertMangement";
import ExpertDetailsPage from "../pages/Admin/ExpertDetailsPage";
import Subscriptoin from "@/pages/Admin/Subscriptoin";

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
      <Route path="/categories" element={<Category/>}></Route>
      <Route path="/services" element={<Services/>}></Route>
      <Route path="/users" element={<UserManagement/>}> </Route>
      <Route path="/experts" element={<ExpertMangement/>} />
      <Route path="/expert/:id" element={<ExpertDetailsPage/>}/> 
      <Route path="/subscription" element={<Subscriptoin/>}/>
    </Routes>
  );
};

export default AdminRoute;
