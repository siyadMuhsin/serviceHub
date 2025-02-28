import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import useAuthCheck from "./CostomHooks/useAuthCheck ";

const App = () => {
  const loading = useAuthCheck(); 

  if (loading) {
    return <h1>Loading...</h1>; 
  }

  return (
    <Router>
      <ToastContainer theme="dark" />
      <AppRoutes />
    </Router>
  );
};

export default App;
