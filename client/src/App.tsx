import { BrowserRouter as Router ,Route,Routes} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/App.routes";
import AdminRoutes from "./routes/Admin.routes";

import Loading from "./components/Loading";
import ExpertRoutes from "./routes/Expert.routes";
import NotFound from "./pages/User/NotFount";



const App = () => {

  return (
    <>
    
    <Router>
      <ToastContainer theme="dark" />
      <Routes>
      <Route path="/*" element={<AppRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/expert/*" element={<ExpertRoutes/>} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    
    </>
  );
};

export default App;