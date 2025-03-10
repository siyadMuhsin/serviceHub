import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { expertSchemaValidation } from "../../../validations/expertValidation";
import { Category, Service, ExpertInfo } from "../../../Interfaces/interfaces";

interface CreateExpertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (expert: ExpertInfo) => void;
    categories: Category[];
    services: Service[];
}


const CreateExpertModal: React.FC<CreateExpertModalProps> = ({ isOpen, onClose, onCreate, categories, services }) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ExpertInfo>({
        resolver: yupResolver(expertSchemaValidation),
    });

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

                <form onSubmit={handleSubmit(onCreate)} className="space-y-2">
                    {/* Full Name */}
                    <input
                        type="text"
                        {...register("fullName")}
                        placeholder="Full Name"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <p className="text-red-500 text-sm">{errors.fullName?.message}</p>

                    {/* DOB */}
                    <input type="date" {...register("dob")} className="w-full p-2 border border-gray-300 rounded" />
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
