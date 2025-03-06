import { toast } from "react-toastify";
const validation = (formData:any) => {
  for (const [key, value] of Object.entries(formData)) {

    if (key !== "age" && !value.trim()) {
      toast.error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required.`);

      return false;
    }

    if (
      key === "confirmPassword" &&
      formData.password !== formData.confirmPassword
    ) {
      toast.error("Passwords do not match.");
      return false;
    }
  }
  return true;
};
export default validation;
