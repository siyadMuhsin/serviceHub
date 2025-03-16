import { useSelector } from "react-redux";
import { Navigate ,Outlet} from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
const LoginRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const AdminProtectRoute = () => {
  const { adminAuthenticated } = useSelector((state: any) => state.adminAuth);

  return adminAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};
const AdminLoginRoute =({children}:{children:React.ReactNode})=>{
  const { adminAuthenticated } = useSelector((state: any) => state.adminAuth);
  return !adminAuthenticated ?children :<Navigate to ='/admin/dashboard' replace />
}
export { ProtectedRoute, LoginRoute,AdminProtectRoute ,AdminLoginRoute};







interface ProtectedExpertRouteProps {
  children: React.ReactNode;
}

const ProtectedExpertRoute: React.FC<ProtectedExpertRouteProps> = ({ children }) => {
  const { role } = useSelector((state: any) => state.auth);

  if (role !== 'expert') {
    return <Navigate to="/" replace />; 
  }

  return <>{children}</>;
};

export default ProtectedExpertRoute;
