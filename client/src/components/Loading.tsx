import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
      <div className="p-4 rounded-lg bg-white shadow-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <p className="mt-2 text-gray-700">Processing...</p>
      </div>
    </div>
  );
};

export default Loading;
