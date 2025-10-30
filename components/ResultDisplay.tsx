
import React from 'react';
import Spinner from './Spinner';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImage }) => {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg p-6 flex flex-col justify-center items-center">
       <h2 className="text-2xl font-bold text-gray-800 mb-4">Your New Look</h2>
      <div className="w-full h-[32rem] border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center bg-gray-50 overflow-hidden">
        {isLoading ? (
            <div className='text-center'>
                <Spinner />
                <p className='mt-4 text-gray-500'>Generating your new look... this may take a moment.</p>
            </div>
        ) : generatedImage ? (
          <img
            src={`data:image/png;base64,${generatedImage}`}
            alt="Generated try-on"
            className="w-full h-full object-contain"
          />
        ) : (
            <div className="text-center text-gray-400 p-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2">Your generated image will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
