import * as yup from "yup";

const today = new Date();
const eighteenYearsAgo = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate()
);

export const expertSchemaValidation = yup.object().shape({
  accountName: yup.string().required("Account Name is required"),
  dob: yup
    .date()
    .max(eighteenYearsAgo, "You must be at least 18 years old")
    .required("Date of Birth is required"),
  gender: yup
    .string()
    .oneOf(["Male", "Female", "Other"], "Select a valid gender")
    .required("Gender is required"),
  contact: yup
    .string()
    .matches(/^\d{10}$/, "Contact must be a 10-digit number")
    .required("Contact information is required"),
  category: yup.string().required("Category is required"),
  service: yup.string().required("Service is required"),
  experience: yup
    .number()
    .typeError("Experience must be a number")
    .min(0, "Experience cannot be negative")
    .required("Experience is required"),
    certificate: yup.mixed<File | FileList | null>()
    .required("Certificate is required")
    .test("fileRequired", "Certificate is required", (value) => {
      return value instanceof File || (value instanceof FileList && value.length > 0);
    }),
});
