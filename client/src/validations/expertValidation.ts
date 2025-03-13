import * as yup from "yup";

export const expertSchemaValidation = yup.object().shape({
    AccountName: yup.string().required("Account Name is required"),
    dob: yup.date().required("Date of Birth is required"),
    gender: yup.string().oneOf(["Male", "Female", "Other"], "Select a valid gender").required("Gender is required"),
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
    certificate: yup.mixed().test("fileRequired", "Certificate is required", (value) => {
        return value instanceof File;
    }),
});
