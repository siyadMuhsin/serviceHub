import React, { useEffect, useState } from "react";
import { adminAuthCheck } from "../services/Admin/adminAuthService";
import { useDispatch } from "react-redux";
import { adminLogin, adminLogout, fetchCategories, fetchServices } from "../Slice/adminAuthSlice";
import { AppDispatch } from "../store"; // Ensure you have a typed Redux store
import { clearEverything } from "../Slice/categoryServiceSlice";

const AdminAuthCheck= () => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch: AppDispatch = useDispatch(); 

  useEffect(() => {
    const fetchAdmin = async (): Promise<void> => {
      try {
        const response = await adminAuthCheck();
        console.log(response)
        if (response.success) {
         
          dispatch(adminLogin());
          dispatch(fetchCategories())
          dispatch(fetchServices())
        } else {
          dispatch(adminLogout());
        }
      } catch (error) {
        console.error("Admin auth check failed:", error);
        dispatch(adminLogout());
        dispatch(clearEverything())
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [dispatch]);

  return loading;
};

export default AdminAuthCheck;
