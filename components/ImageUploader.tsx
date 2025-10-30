import React, { useRef } from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  // Fix: Changed type from JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactNode;
  onImageUpload: (file: File) => void;
  imagePreviewUrl: string | null;
  onClear: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  label,
  icon,
  onImageUpload,
  imagePreviewUrl,
  onClear
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
    if(inputRef.current) {
        inputRef.current.value = "";
    }
  }

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-lg font-medium text-gray-700 mb-2">{label}</label>
      <div 
        className="relative group w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center cursor-pointer hover:border-indigo-500 transition-colors duration-300 bg-gray-50"
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          id={id}
          ref={inputRef}
          accept="image/png, image/jpeg"
          className="sr-only"
          onChange={handleFileChange}
        />
        {imagePreviewUrl ? (
          <>
            <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg p-2" />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Clear image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-center text-gray-400">
            {icon}
            <p className="mt-2">Click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;