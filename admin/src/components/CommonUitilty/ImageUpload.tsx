import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageSelect: (file: File | null, previewUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageSelect }) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Send both file and preview URL back
    onImageSelect(file, url);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Image</label>
      <div className="flex items-center space-x-4">
        <div className="relative">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="object-cover w-32 h-32 rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="text-sm text-gray-500">
          <p>Click to upload or drag and drop</p>
          <p>SVG, PNG, JPG (max. 5MB)</p>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUpload;