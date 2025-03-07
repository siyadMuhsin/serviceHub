import { adminAPI } from "../../../axiosConfig";

export const getCategories = async () => {
  try {
    const response = await adminAPI.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [] };
  }
};
export const addCategory = async (formData:FormData) => {
  try {
    const response = await adminAPI.post("/category", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // This is optional
      },
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const category_list_unlist = async (id: string, status: boolean) => {
  try {
    const response = await adminAPI.patch(`/category/${id}/status`);
    return response.data;
  } catch (error: any) {
    return error.data;
  }
};
