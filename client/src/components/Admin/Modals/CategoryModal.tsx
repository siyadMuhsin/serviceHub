import React, { useState, useEffect } from "react";
import ImageCropper from "../../../Utils/ImageCropper";
import validation from "../../../validations/formValidation";

interface Category {
  name: string;
  description: string;
  image: File | null | string;
}

interface CategoryModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    categoryData: FormData,
    isEdit: boolean
  ) => void;
  categoryToEdit?: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  categoryToEdit,
}) => {
  const [category, setCategory] = useState<Category>({
    name: "",
    description: "",
    image: null,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [isNewImage, setIsNewImage] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setCategory(categoryToEdit);
      if (typeof categoryToEdit.image === "string") {
        setImagePreview(categoryToEdit.image);
        setIsNewImage(false);
      }
    }
  }, [categoryToEdit]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
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
    setCategory({ ...category, image: null });
    setImagePreview(null);
    setCroppedFile(null);
    setIsNewImage(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valid = validation({ name: category.name, description: category.description });

    if (!valid) return;

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("description", category.description);

    if (croppedFile) {
      formData.append("image", croppedFile);
    } else if (categoryToEdit?.image && !isNewImage) {
      formData.append("image", categoryToEdit.image as string);
    }

    handleSubmit(e, formData, !!categoryToEdit);
  };

  const closeModal = () => {
    setCategory({ name: "", description: "", image: null });
    setSelectedImage(null);
    setImagePreview(null);
    setCroppedFile(null);
    setIsNewImage(false);
    setIsModalOpen(false);
    if (categoryToEdit) {
      categoryToEdit = null;
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
        <div className="bg-[#2A2A3C] p-6 rounded-lg shadow-lg text-white w-96 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">{categoryToEdit ? "Edit Category" : "Add Category"}</h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              value={category.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 rounded bg-[#1E1E2F] text-white"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={category.description}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 rounded bg-[#1E1E2F] text-white"
              required
            />

            {imagePreview && !isNewImage && (
              <div className="mb-3 relative">
                <img src={imagePreview} alt="Current" className="w-full h-auto rounded" />
                <button type="button" onClick={removeImage} className="absolute top-0 right-0 bg-red-600 p-1 text-xs text-white rounded">
                  Remove
                </button>
              </div>
            )}
            {!imagePreview&&
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 mb-3 rounded bg-[#1E1E2F] text-white"
            />}

            {isNewImage && imagePreview && <ImageCropper imageSrc={imagePreview} setCroppedFile={setCroppedFile} />}

            {croppedFile && (
              <div className="mb-3">
                <img src={URL.createObjectURL(croppedFile)} alt="Cropped" className="w-full h-auto rounded" />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#3F8CFF] text-white rounded hover:bg-[#2C6FD4]">
                {categoryToEdit ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CategoryModal;
