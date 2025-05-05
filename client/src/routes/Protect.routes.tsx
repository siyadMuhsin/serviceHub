import { RootState } from "@/store";
import { Role } from "@/types";
import { useSelector } from "react-redux";
import { Navigate ,Outlet} from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated ,role} = useSelector((state: RootState) => state.auth);
if(role===Role.EXPERT)return <Navigate to={'/expert'}/>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
const LoginRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const AdminProtectRoute = () => {
  const { adminAuthenticated } = useSelector((state: RootState) => state.adminAuth);
  return adminAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};
const AdminLoginRoute =({children}:{children:React.ReactNode})=>{
  const { adminAuthenticated } = useSelector((state: RootState) => state.adminAuth);
  return !adminAuthenticated ?children :<Navigate to ='/admin/dashboard' replace />
}
export { ProtectedRoute, LoginRoute,AdminProtectRoute ,AdminLoginRoute};







interface ProtectedExpertRouteProps {
  children: React.ReactNode;
}

const ProtectedExpertRoute: React.FC<ProtectedExpertRouteProps> = ({ children }) => {
  const { role } = useSelector((state: RootState) => state.auth);

  if (role !== 'expert') {
    return <Navigate to="/" replace />; 
  }

  return <>{children}</>;
};

export default ProtectedExpertRoute;
