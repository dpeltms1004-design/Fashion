
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-md p-4 mb-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Virtual Fashion Try-On
        </h1>
        <p className="text-gray-500 mt-2">
          See your new look in seconds with Gemini
        </p>
      </div>
    </header>
  );
};

export default Header;
