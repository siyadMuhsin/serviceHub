import React, { useState } from "react";
import ImageCropper from "../../../Utils/ImageCropper"; // Import the reusable cropper component
import validation from "../../../validations/formValidation";

interface AddCategoryModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, category: { name: string; description: string; image: File | null }) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isModalOpen, setIsModalOpen, handleSubmit }) => {
  const [newCategory, setNewCategory] = useState<{ name: string; description: string; image: File | null }>({
    name: "",
    description: "",
    image: null,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL); // Ensure image is set before rendering cropper
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valid= validation({name:newCategory.name,descripton:newCategory.description})
    
    if(!valid)return;
    const formData:FormData=new FormData()
    formData.append('name',newCategory.name)
    formData.append('description',newCategory.description)
    if (croppedFile) {
      formData.append("image", croppedFile);
    }
   
    
    // setNewCategory(updatedCategory);
    handleSubmit(e, formData);
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  " >
        <div className="bg-[#2A2A3C] p-6 rounded-lg shadow-lg text-white w-96 max-h-[80vh] overflow-y-auto scrollba">
          <h2 className="text-xl font-bold mb-4">Add Category</h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Category Name" 
              value={newCategory.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 rounded bg-[#1E1E2F] text-white"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newCategory.description}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 rounded bg-[#1E1E2F] text-white"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 mb-3 rounded bg-[#1E1E2F] text-white"
              required
            />

            {imagePreview && <ImageCropper imageSrc={imagePreview} setCroppedFile={setCroppedFile} />}

            {croppedFile && (
              <div className="mb-3">
                <img src={URL.createObjectURL(croppedFile)} alt="Cropped" className="w-full h-auto rounded" />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#3F8CFF] text-white rounded hover:bg-[#2C6FD4]">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddCategoryModal;
