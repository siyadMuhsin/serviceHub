import React, { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropper = ({ imageSrc, setCroppedFile }) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
    aspect: 1, // Fixed aspect ratio (1:1)
  });

  const imgRef = useRef<HTMLImageElement | null>(null);

  const onCropComplete = async (croppedArea: PixelCrop) => {
    if (!imgRef.current || croppedArea.width === 0 || croppedArea.height === 0) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = croppedArea.width;
    canvas.height = croppedArea.height;

    if (!ctx) return;
    ctx.drawImage(
      image,
      croppedArea.x * scaleX,
      croppedArea.y * scaleY,
      croppedArea.width * scaleX,
      croppedArea.height * scaleY,
      0,
      0,
      croppedArea.width,
      croppedArea.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
        setCroppedFile(file);
      }
    }, "image/jpeg");
  };

  return (
    <div className="mb-3">
      <ReactCrop
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
        onComplete={onCropComplete}
        aspect={1} // Ensuring a fixed square aspect ratio
      >
        <img ref={imgRef} src={imageSrc} alt="Crop Preview" className="w-full" />
      </ReactCrop>
    </div>
  );
};

export default ImageCropper;
