import React, { useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const AddCategoryModal = ({ isModalOpen, setIsModalOpen, handleSubmit }) => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Crop completed handler
  const onCropComplete = (crop: Crop) => {
    if (!imagePreview) return;
    const img = new Image();
    img.src = imagePreview;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
  
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
  
      canvas.width = crop.width;
      canvas.height = crop.height;
      ctx.drawImage(
        img,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
  
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedImageUrl = URL.createObjectURL(blob);
          setCroppedImage(croppedImageUrl);
          setNewCategory({ ...newCategory, image: croppedImageUrl });
        }
      }, "image/jpeg");
    };
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-[#2A2A3C] p-6 rounded-lg shadow-lg text-white w-96">
          <h2 className="text-xl font-bold mb-4">Add Category</h2>
          <form onSubmit={(e) => handleSubmit(e, newCategory)}>
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

            {/* Image Preview and Cropper */}
            {imagePreview && (
              <div className="mb-3">
                <ReactCrop
                  src={imagePreview}
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop)}
                  onComplete={onCropComplete}
                />
              </div>
            )}

            {/* Cropped Image Preview */}
            {croppedImage && (
              <div className="mb-3">
                <img src={croppedImage} alt="Cropped" className="w-full h-auto rounded" />
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
