import React, { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropper = ({ imageSrc, setCroppedFile }) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Use percentage for responsive cropping
    width: 50, // Initial width of the crop area
    height: (50 * 2) / 3, // Initial height based on 3:2 aspect ratio
    x: 25, // Initial x position
    y: 25, // Initial y position

  });

  const imgRef = useRef<HTMLImageElement | null>(null);

  // Adjust initial crop height based on image dimensions
  useEffect(() => {
    if (imgRef.current) {
      const img = imgRef.current;
      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const desiredAspectRatio = 3 / 2;

      if (imgAspectRatio > desiredAspectRatio) {
        // Image is wider than 3:2, adjust height
        setCrop((prevCrop) => ({
          ...prevCrop,
          height: (prevCrop.width * 2) / 3,
        }));
      } else {
        // Image is taller than 3:2, adjust width
        setCrop((prevCrop) => ({
          ...prevCrop,
          width: (prevCrop.height * 3) / 2,
        }));
      }
    }
  }, [imageSrc]);

  const onCropComplete = async (croppedArea: PixelCrop) => {
    if (!imgRef.current || croppedArea.width === 0 || croppedArea.height === 0) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas dimensions to match the original image's resolution
    canvas.width = croppedArea.width * scaleX;
    canvas.height = croppedArea.height * scaleY;

    if (!ctx) return;
    ctx.drawImage(
      image,
      croppedArea.x * scaleX,
      croppedArea.y * scaleY,
      croppedArea.width * scaleX,
      croppedArea.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert canvas to a high-quality Blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
          setCroppedFile(file);
        }
      },
      "image/jpeg",
      1 // Quality set to 1 (highest quality)
    );
  };

  return (
    <div className="mb-3">
      <ReactCrop
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
        onComplete={onCropComplete}
        aspect={3 / 2} // Fixed aspect ratio (3:2)
        keepSelection={true} // Keep the crop selection even when resizing
      >
        <img ref={imgRef} src={imageSrc} alt="Crop Preview" className="w-full" />
      </ReactCrop>
    </div>
  );
};

export default ImageCropper;