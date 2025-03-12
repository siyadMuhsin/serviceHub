import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-12">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 0}
        className={`px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 ${
          currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(index)}
          className={`px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 ${
            currentPage === index ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          {index + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        className={`px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 ${
          currentPage === totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;