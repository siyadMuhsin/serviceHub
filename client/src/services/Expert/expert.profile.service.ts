import { expertAPI } from "config/axiosConfig";

const locationAdd = async (data: { lat: number; lng: number }) => {
  try {
    const response = await expertAPI.post("/profile/location", { data });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
const uploadImage = async (formData: FormData) => {
  try {
    const response = await expertAPI.post("/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
const removeImage=async(url:string)=>{
    try {
        const response = await expertAPI.delete('/profile/image', {
            data: { imageUrl: url }
          });
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)
        
    }
}
export { locationAdd, uploadImage ,removeImage};
