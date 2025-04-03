import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { expertSchemaValidation } from "../../../validations/expertValidation";
import { Category, Service, ExpertData } from "../../../Interfaces/interfaces";
import { getAll_categories, getAll_services } from "@/services/category.service";

interface CreateExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (expert: ExpertData) => void;
 
  existingData?: ExpertData;
}

const CreateExpertModal: React.FC<CreateExpertModalProps> = ({
  isOpen,
  onClose,
  onCreate,
 
  existingData,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpertData>({
    resolver: yupResolver(expertSchemaValidation),
    defaultValues: existingData || {},
  });

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const servicesResponse = await getAll_services();
      if (servicesResponse.success) {
        setServices(servicesResponse.services);
      }
      const categoriesResponse = await getAll_categories();
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.categories);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (existingData) {
      setValue("accountName", existingData.accountName);
      setValue("dob", existingData.dob.split("T")[0]); // Format date for input
      setValue("gender", existingData.gender);
      setValue("contact", existingData.contact);
      setValue("category", existingData.category?._id || "");
      setValue("service", existingData.service?._id || "");
      setValue("experience", existingData.experience);
      setValue("certificate", existingData.certificate);
    }
  }, [existingData, setValue]);

  const categoryValue = watch("category");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCertificateFile(e.target.files[0]);
      setValue("certificate", e.target.files[0]); // Set file in form data
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-lg">
        <h2 className="text-lg font-semibold mb-4">
          {existingData ? "Edit Expert Account" : "Create Expert Account"}
        </h2>

        <form
          onSubmit={handleSubmit((data) => {
           
              onCreate(data);
            
          })}
          className="space-y-2"
        >
          {/* Account Name */}
          <input
            type="text"
            {...register("accountName")}
            placeholder="Account Name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-red-500 text-sm">{errors.accountName?.message}</p>

          {/* DOB */}
          <input
            type="date"
            {...register("dob")}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-red-500 text-sm">{errors.dob?.message}</p>

          {/* Gender */}
          <select {...register("gender")} className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <p className="text-red-500 text-sm">{errors.gender?.message}</p>

          {/* Contact */}
          <input
            type="text"
            {...register("contact")}
            placeholder="Contact Information"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-red-500 text-sm">{errors.contact?.message}</p>

          {/* Category */}
          <select {...register("category")} className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-sm">{errors.category?.message}</p>

          {/* Services */}
          <select {...register("service")} className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Service</option>
            {services
              .filter((service) => service.categoryId._id === categoryValue)
              .map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
          </select>
          <p className="text-red-500 text-sm">{errors.service?.message}</p>

          {/* Experience */}
          <input
            type="number"
            {...register("experience")}
            placeholder="Years of Experience"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-red-500 text-sm">{errors.experience?.message}</p>

          {/* Certificate Upload */}
          <label className="block text-sm font-medium text-gray-700">
            Upload Certificate:
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {existingData?.certificate && !certificateFile && (
            <p className="text-gray-500 text-sm">
              Current file:{" "}
              <a
                href={existingData.certificate}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Certificate
              </a>
            </p>
          )}
          <p className="text-red-500 text-sm">{errors.certificate?.message}</p>

          {/* Buttons */}
          <div className="flex justify-end mt-4">
            <button type="button" className="mr-2 px-4 py-2 bg-gray-400 text-white rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {existingData.accountName ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExpertModal;
