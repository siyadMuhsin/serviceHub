import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginService } from "../../../services/Admin/adminAuth.service";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin} from "../../../Slice/adminAuthSlice";
import { toast } from "react-toastify";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const isLogined=useSelector((state)=>state.)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminLoginService(email, password);
      if (response.success) {
        dispatch(adminLogin());
       
        // dispatch(fetchCategories())
        // dispatch(fetchServices())
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1E1E2F] font-poppins">
      <div className="bg-[#2A2A3C] bg-opacity-80 backdrop-blur-md rounded-xl p-10 w-[350px] shadow-[0_0_15px_rgba(63,140,255,0.3)]">
        <h2 className="text-2xl font-bold mb-8 text-center text-white">Admin Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-5 p-3 rounded-lg bg-[#2A2A3C] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3F8CFF]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-5 p-3 rounded-lg bg-[#2A2A3C] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3F8CFF]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="p-3 rounded-lg bg-[#3F8CFF] text-white font-semibold hover:bg-[#357ACC] transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;