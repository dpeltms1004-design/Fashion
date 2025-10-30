import React, { useState, useCallback } from 'react';
import { ImageFile } from './types';
import { generateFittingImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';

const PersonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const TopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const BottomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 2L3 8v11h18V8L12 2zM9 21v-5a3 3 0 016 0v5" />
    </svg>
);

function App() {
  const [personImage, setPersonImage] = useState<ImageFile | null>(null);
  const [topImage, setTopImage] = useState<ImageFile | null>(null);
  const [bottomImage, setBottomImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // remove data:mime/type;base64,
        };
        reader.onerror = (error) => reject(error);
    });
    
  const handleImageUpload = useCallback(async (file: File, type: 'person' | 'top' | 'bottom') => {
    if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPG).');
        return;
    }
    
    try {
        const base64 = await fileToBase64(file);
        const imageFileData: ImageFile = {
            preview: URL.createObjectURL(file),
            base64,
            mimeType: file.type
        };

        if (type === 'person') {
            setPersonImage(imageFileData);
        } else if (type === 'top') {
            setTopImage(imageFileData);
        } else {
            setBottomImage(imageFileData);
        }
        setError(null);
    } catch (err) {
        setError('Failed to process image file.');
        console.error(err);
    }
  }, []);

  const handleGenerate = async () => {
    if (!personImage || !topImage || !bottomImage) {
      setError("Please upload a person, top, and bottom image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateFittingImage(personImage, topImage, bottomImage);
      setGeneratedImage(resultBase64);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !personImage || !topImage || !bottomImage || isLoading;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                <ImageUploader
                    id="person-upload"
                    label="1. Upload Person's Photo"
                    icon={<PersonIcon />}
                    onImageUpload={(file) => handleImageUpload(file, 'person')}
                    imagePreviewUrl={personImage?.preview || null}
                    onClear={() => setPersonImage(null)}
                />
                <ImageUploader
                    id="top-upload"
                    label="2. Upload Top Photo"
                    icon={<TopIcon />}
                    onImageUpload={(file) => handleImageUpload(file, 'top')}
                    imagePreviewUrl={topImage?.preview || null}
                    onClear={() => setTopImage(null)}
                />
                 <ImageUploader
                    id="bottom-upload"
                    label="3. Upload Bottom Photo"
                    icon={<BottomIcon />}
                    onImageUpload={(file) => handleImageUpload(file, 'bottom')}
                    imagePreviewUrl={bottomImage?.preview || null}
                    onClear={() => setBottomImage(null)}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isButtonDisabled}
                    className={`w-full py-3 px-4 text-lg font-semibold rounded-lg text-white transition-all duration-300 ${
                        isButtonDisabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                >
                    {isLoading ? 'Generating...' : 'Try It On!'}
                </button>
            </div>
            
            <div className="lg:row-start-1 lg:col-start-2">
                <ResultDisplay isLoading={isLoading} generatedImage={generatedImage} />
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;
