import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full h-64 lg:h-full flex items-center justify-center">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`w-full h-full flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-gray-700' : 'border-gray-600 hover:border-indigo-500 hover:bg-gray-700'}`}
      >
        <div className="w-full h-full flex flex-col items-center justify-center">
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain p-2 rounded-lg" />
          ) : (
            <div className="flex flex-col items-center text-gray-400 p-4">
              <UploadIcon className="w-12 h-12 mb-2" />
              <p className="font-semibold">Click to upload or drag & drop</p>
              <p className="text-xs">PNG, JPG, WEBP, etc.</p>
            </div>
          )}
        </div>
      </label>
    </div>
  );
};
