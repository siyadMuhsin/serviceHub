import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
const LoginRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export { ProtectedRoute, LoginRoute };
