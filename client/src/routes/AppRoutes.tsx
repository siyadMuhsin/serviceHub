import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/User/Auth/Login";
import Landing from "../pages/User/Home/Landing";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
