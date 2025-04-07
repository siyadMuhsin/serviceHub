import React, { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import ImageCropper from '../../Utils/ImageCropper';
import { removeImage, uploadImage } from '@/services/Expert/expert.profile.service';
import { toast } from 'react-toastify';
import Loading from '../Loading';
import ConfirmModal from '@/Utils/Confirmation';

function ExpertGallery({ expertData }) {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState(null); // base64 string
  const [cropBlob, setCropBlob] = useState(null); // File from cropper ref
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{index: number, url: string} | null>(null);

  useEffect(() => {
    setImages(expertData.gallery || []);
  }, [expertData.gallery]);

  const handleDeleteClick = (index: number, imageUrl: string) => {
    setImageToDelete({ index, url: imageUrl });
    setIsConfirmation(true);
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;
    
    try {
      setIsLoading(true);
      const response = await removeImage(imageToDelete.url);
      if (response.success) {
        setImages(images.filter((_, i) => i !== imageToDelete.index));
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setIsConfirmation(false);
      setImageToDelete(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropConfirm = () => {
    setShowCropModal(false);
  };

  const handleUpload = async () => {
    if (!cropBlob) return;
  
    setIsUploading(true);
  
    try {
      const formData = new FormData();
      formData.append('image', cropBlob);
      const response = await uploadImage(formData);
      if (response.success) {
        setImages(prev => [...prev, response.imageUrl]);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
  
      // Reset states
      setSelectedFile(null);
      setCropBlob(null);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Work Showcase</h3>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <FiPlus /> Add Work
        </button>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img 
                src={imageUrl} 
                alt={`Work sample ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg cursor-pointer"
                onClick={() => window.open(imageUrl, "_blank")}
              />
              <button
                onClick={() => handleDeleteClick(index, imageUrl)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                title="Delete image"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          No work samples added yet
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Work Sample</h3>
              <button onClick={() => {
                setShowUploadModal(false);
                setSelectedFile(null);
                setCropBlob(null);
              }}>
                <FiX className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  {selectedFile ? (
                    <img 
                      src={cropBlob ? URL.createObjectURL(cropBlob) : selectedFile} 
                      alt="Preview" 
                      className="h-full w-full object-contain p-2" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiPlus className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setCropBlob(null);
                    setIsUploading(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !cropBlob}
                  className={`px-4 py-2 rounded-md text-white ${isUploading || !cropBlob ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-2">Crop Your Image</h2>
            <ImageCropper imageSrc={selectedFile} setCroppedFile={setCropBlob} />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setSelectedFile(null);
                  setCropBlob(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Crop
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isLoading && <Loading />}
      
      <ConfirmModal
        isOpen={isConfirmation}
        message="Are you sure you want to remove this image?"
        onCancel={() => {
          setIsConfirmation(false);
          setImageToDelete(null);
        }}
        onConfirm={handleDeleteImage}
      />
    </div>
  );
}

export default ExpertGallery;