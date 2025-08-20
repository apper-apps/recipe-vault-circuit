import React, { useState, useRef } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ImageUpload = ({ onImageSelect, currentImage, onOCRData }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      handleFileSelect(files[0]);
    }
  };

const handleFileSelect = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      onImageSelect(e.target.result);
      
      // Show OCR prompt after image is loaded
      if (onOCRData && window.confirm("Would you like to extract recipe information from this image using OCR?")) {
        await handleOCRExtraction(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOCRExtraction = async (file) => {
    try {
      setIsOCRProcessing(true);
      
      // Dynamic import of Tesseract.js
      const Tesseract = await import('tesseract.js');
      
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      });
      
      if (text.trim()) {
        // Parse OCR text into recipe data
        const { aiRecipeService } = await import('@/services/api/aiRecipeService');
        const parsedData = aiRecipeService.parseOCRText(text);
        onOCRData(parsedData);
      } else {
        alert("No text could be extracted from the image. Please try a different image or enter the recipe manually.");
      }
    } catch (error) {
      console.error('OCR Error:', error);
      alert("Failed to extract text from image. Please try again or enter the recipe manually.");
    } finally {
      setIsOCRProcessing(false);
    }
  };

const [isOCRProcessing, setIsOCRProcessing] = useState(false);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    onImageSelect("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Recipe preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        </div>
      ) : (
        <div
          className={`upload-area ${dragOver ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Upload" size={32} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload Recipe Image
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop an image here, or click to select
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <input
ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;