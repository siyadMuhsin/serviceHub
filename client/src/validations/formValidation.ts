import { toast } from "react-toastify";

const validation = (formData: any) => {
  for (const [key, value] of Object.entries(formData)) {
    if (key !== "age" && typeof value === "string" && !value.trim()) {
      toast.error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required.`);
      return false;
    }

    // ✅ Email validation
    if (key === "email" && typeof value=='string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        toast.error("Please enter a valid email address.");
        return false;
      }
    }

    // ✅ Password confirmation check
    if (key === "confirmPassword" && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
  }
  return true;
};

export default validation;
