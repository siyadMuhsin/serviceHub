import React, { useEffect, useState } from "react";
import {
  setInitialCategories,
  setInitialServices,
} from "../Slice/categoryServiceSlice";
import { userAPI, adminAPI } from "../../axiosConfig";
import { useDispatch } from "react-redux";
function useFetchData() {
  const [loading,setLoading]=useState<boolean>(true)
    const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
        try {
            const categoriesRes = await adminAPI.get("/categories");
            if (categoriesRes.data.success) {
              dispatch(setInitialCategories(categoriesRes.data.categories));
            }
            // ✅ Fetch services
            const servicesRes = await adminAPI.get("/services");
            if (servicesRes.data.success) {
              dispatch(setInitialServices(servicesRes.data.services));
            }
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
     
    };
    fetchData()
  },[]);
  return loading
}

export default useFetchData;
