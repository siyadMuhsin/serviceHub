import React, { useEffect, useState } from "react";
import { adminAuthCheck } from "../services/Admin/adminAuth.service";
import { useDispatch } from "react-redux";
import { adminLogin, adminLogout} from "../Slice/adminAuthSlice";
import { AppDispatch } from "../store"; // Ensure you have a typed Redux store

//admin auth hook
const AdminAuthCheck= () => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch: AppDispatch = useDispatch(); 

  useEffect(() => {
    const fetchAdmin = async (): Promise<void> => {
      try {
        const response = await adminAuthCheck();
        if (response.success) {
         
          dispatch(adminLogin());
         
        } else {
          dispatch(adminLogout());
        }
      } catch (error) {
        console.error("Admin auth check failed:", error);
        dispatch(adminLogout());
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [dispatch]);

  return loading;
};

export default AdminAuthCheck;
