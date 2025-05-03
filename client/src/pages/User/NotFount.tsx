// src/components/NotFound.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 animate-gradient-x">
      <div className="text-center space-y-8">
        <h1 className="text-9xl font-bold text-white animate-bounce">404</h1>
        <p className="text-2xl text-white font-semibold">Oops! Page not found.</p>
        <p className="text-lg text-white">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-lg font-semibold text-white bg-gray-700 rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 text-lg font-semibold text-white bg-black rounded-full hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
          >
            Go Home
          </button>
        </div>
      </div>
      <div className="mt-12">
        <div className="w-24 h-24 bg-white rounded-full animate-spin-slow"></div>
      </div>
      <div className="absolute bottom-0 w-full h-16 bg-white bg-opacity-20 backdrop-blur-md"></div>
    </div>
  );
};

export default NotFound;
