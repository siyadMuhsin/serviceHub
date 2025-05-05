import React, { useState, useEffect } from "react";
import ImageCropper from "../../../Utils/ImageCropper";
import validation from "../../../validations/formValidation";
import { toast } from "react-toastify";
import { getAll_categories } from "@/services/category.service";
import { Category, IServices } from "@/Interfaces/interfaces";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceData: FormData, isEdit: boolean) => void;
  serviceToEdit?: IServices | null;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  serviceToEdit,
}) => {
  const [service, setService] = useState<{
    _id: string;
    name: string;
    description: string;
    image: string | null;
    categoryId: string;
  }>({
    _id: "",
    name: "",
    description: "",
    image: null,
    categoryId: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [isNewImage, setIsNewImage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (serviceToEdit) {
      setService({
        _id: serviceToEdit._id || "",
        name: serviceToEdit.name,
        description: serviceToEdit.description,
        image: typeof serviceToEdit.image === "string" ? serviceToEdit.image : null,
        categoryId: serviceToEdit.categoryId._id,
      });
      if (typeof serviceToEdit.image === "string") {
        setImagePreview(serviceToEdit.image);
        setIsNewImage(false);
      }
    }

    const fetchCategory = async () => {
      try {
        const response = await getAll_categories();
        if (response.success) {
          setCategories(response.categories);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch categories");
      }
    };

    fetchCategory();
  }, [serviceToEdit]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setService((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsNewImage(true);
    }
  };

  const removeImage = () => {
    setService((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    setCroppedFile(null);
    setIsNewImage(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validation({
      name: service.name,
      description: service.description,
    });

    if (!isValid) return;

    const formData = new FormData();
    formData.append("name", service.name);
    formData.append("description", service.description);
    formData.append("categoryId", service.categoryId);

    if (croppedFile) {
      formData.append("image", croppedFile);
    } else if (serviceToEdit?.image && !isNewImage) {
      formData.append("image", serviceToEdit.image);
    } else {
      toast.error("Image is required");
      return;
    }

    onSave(formData, !!serviceToEdit);
    closeModal();
  };

  const closeModal = () => {
    setService({
      _id: "",
      name: "",
      description: "",
      image: null,
      categoryId: "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    setCroppedFile(null);
    setIsNewImage(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-[#2A2A3C] p-6 rounded-lg shadow-lg text-white w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {serviceToEdit ? "Edit Service" : "Add Service"}
        </h2>
        <form onSubmit={handleFormSubmit} className="flex flex-col space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Service Name"
            value={service.name}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-[#1E1E2F] text-white"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={service.description}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-[#1E1E2F] text-white"
            required
          />
          <select
            name="categoryId"
            value={service.categoryId}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-[#1E1E2F] text-white"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          {imagePreview && !isNewImage && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Current"
                className="w-full h-auto rounded"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-0 right-0 bg-red-600 p-1 text-xs text-white rounded"
              >
                Remove
              </button>
            </div>
          )}

          {!imagePreview && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 rounded bg-[#1E1E2F] text-white"
            />
          )}

          {isNewImage && imagePreview && (
            <ImageCropper
              imageSrc={imagePreview}
              setCroppedFile={setCroppedFile}
            />
          )}

          {croppedFile && (
            <div>
              <img
                src={URL.createObjectURL(croppedFile)}
                alt="Cropped"
                className="w-full h-auto rounded"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#3F8CFF] text-white rounded hover:bg-[#2C6FD4]"
            >
              {serviceToEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
