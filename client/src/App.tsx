import { BrowserRouter as Router ,Route,Routes} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./routes/AdminRoute";
import useFetchData from "./CostomHooks/useFetchData";
import Loading from "./components/Loading";
import ExpertRoutes from "./routes/ExpertRoutes";



const App = () => {
  const loading = useFetchData();
if(loading){
  return <Loading/>
}
  return (
    <>
    
    <Router>
      <ToastContainer theme="dark" />
      <Routes>
      <Route path="/*" element={<AppRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/expert/*" element={<ExpertRoutes/>} />
      </Routes>
     
          {/* <Route path="/mentor/*" element={<MentorRoutes />} />
           */}
      
    </Router>
    
    </>
  );
};

export default App;