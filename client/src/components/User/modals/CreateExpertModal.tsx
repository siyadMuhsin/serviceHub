import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { expertSchemaValidation } from "../../../validations/expertValidation";
import { Category, Service, ExpertData } from "../../../Interfaces/interfaces";

import { getServices } from "../../../services/Admin/service.service";
import { getCategories } from "../../../services/Admin/category.service";

interface CreateExpertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (expert: ExpertData) => void;
    categories: Category[];
    services: Service[];
}


const CreateExpertModal: React.FC<CreateExpertModalProps> = ({ isOpen, onClose, onCreate}) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ExpertData>({
        resolver: yupResolver(expertSchemaValidation),
    });
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(()=>{
        const fetchData=async()=>{
            const serivces=await getServices()
            if(serivces.success){
                setServices(serivces.services)
            }
            const categories=await getCategories()
            if(categories.success){
                setCategories(categories.categories)
            }
        }
        fetchData()
    },[])
    const categoryValue = watch("category"); 

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setValue("certificate", e.target.files[0]); // Set file value manually
        }
    };

  

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-lg">
                <h2 className="text-lg font-semibold mb-4">Create Expert Account</h2>

                <form onSubmit={handleSubmit((data) => onCreate(data))} className="space-y-2">
                    {/* Account Name */}
                    <input
                        type="text"
                        {...register("AccountName")}
                        placeholder="Account Name"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <p className="text-red-500 text-sm">{errors.AccountName?.message}</p>

                    {/* DOB */}
                    
                    <div className="relative w-full">
  <label htmlFor="dob" className=" text-gray-400 top-2 left-2 text-sm transition-all pointer-events-none">
    Date of Birth
  </label>
  <input
    type="date"
    id="dob"
    {...register("dob")}
    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 "
    
  />
  <p className="text-red-500 text-sm">{errors.dob?.message}</p>
</div>
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

                    {/* Services (Filtered based on selected Category) */}
                    <select {...register("service")} className="w-full p-2 border border-gray-300 rounded">
                        <option value="">Select Service</option>
                        {services
                            .filter((service) => service.categoryId._id === categoryValue)
                            .map((service:any) => (
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
                        min="0"
                    />
                    <p className="text-red-500 text-sm">{errors.experience?.message}</p>

                    {/* Certificate Upload */}
                    <label className="block text-sm font-medium text-gray-700">Upload Certificate:</label>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <p className="text-red-500 text-sm">{errors.certificate?.message}</p>

                    {/* Buttons */}
                    <div className="flex justify-end mt-4">
                        <button type="button" className="mr-2 px-4 py-2 bg-gray-400 text-white rounded" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateExpertModal;
