import { Form } from "react-router-dom";
import { adminAPI } from "../../../config/axiosConfig";

export const getServices = async (page:number,limit:number,search:string) => {
  try {
    const response = await adminAPI.get(`/services?page=${page+1}&limit=${limit}&search=${search}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return { services: [] };
  }
};
export const add_service = async (formData: FormData) => {
  try {
    const resonse = await adminAPI.post("/service", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return resonse.data;
  } catch (err: any) {
    return err.response.data;
  }
};

export const service_list_unlist=async(id:string)=>{
    try {
        const response= await adminAPI.patch(`/service/${id}/status`)
        return response.data
    } catch (error) {
        console.log("err",error)
        
    }

} 
export const edit_service=async(id:string,formData:FormData)=>{
    try {
        const response= await adminAPI.put(`/service/${id}`,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })
        return response.data
    } catch (error:any) {
        return error.data
        
    }

}
