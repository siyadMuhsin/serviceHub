import { Routes, Route } from "react-router-dom";
import Login from "../pages/User/Auth/Login";
import Landing from "../pages/User/Home/Landing";
import {ProtectedRoute,LoginRoute} from "./ProtectRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" 
       element={
        <LoginRoute>
            <Login/>
        </LoginRoute>
      } />
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
