import { adminAPI } from "../../../config/axiosConfig";

export const getCategories = async (page:number,limit:number ,search:string) => {
  try {
    const response = await adminAPI.get(`/categories?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [] };
  }
};
export const addCategory = async (formData: FormData) => {
  try {
    const response = await adminAPI.post("/category", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error in category create");
    // return error.response.data
  }
};
export const category_list_unlist = async (id: string, ) => {
  try {
    const response = await adminAPI.patch(`/category/${id}/status`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error in category status change");
  }
};

export const edit_category = async (id: string, formData: FormData) => {
  try {
    const response = await adminAPI.put(`/category/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Faild to update category")
  }
};


