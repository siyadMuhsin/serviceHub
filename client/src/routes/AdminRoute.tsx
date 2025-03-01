import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./../pages/Admin/Auth/AdminLogin ";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import AdminPrivateRoute from "./components/AdminPrivateRoute";

const AdminRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* <Route element={<AdminPrivateRoute />}> */}
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        {/* </Route> */}
      </Routes>
    </Router>
  );
};

export default AdminRoute;
