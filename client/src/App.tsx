import { BrowserRouter as Router ,Route,Routes} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./routes/AdminRoute";



const App = () => {
 

  return (
    <>
    
    <Router>
      <ToastContainer theme="dark" />
      <Routes>
      <Route path="/*" element={<AppRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
     
          {/* <Route path="/mentor/*" element={<MentorRoutes />} />
           */}
      
    </Router>
    
    </>
  );
};

export default App;
