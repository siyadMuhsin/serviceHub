import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeRole, loginSuccess, logout } from "../Slice/authSlice";
import { userAPI, adminAPI } from "../../config/axiosConfig";
import { toast } from "react-toastify";

const useAuthCheck = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userAPI.get("/auth/me", {
          withCredentials: true,
        });
        if (response.data.success) {
          let role = response.data.role;
console.log('role from customhooks :',response.data.role);

          if (role === "expert") {
            dispatch(changeRole("expert"));
          }
          dispatch(loginSuccess(response.data));
        } else {
          dispatch(logout());
        }
      } catch (error) {

        if (error.response.status == 403) {
          toast.error(error.response.data.message);
          return;
        } else {
          dispatch(logout());
        // toast.error(error.response.data.message);

        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  return loading;
};

export default useAuthCheck;
