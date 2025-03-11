import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const Category: React.FC = () => {
  const { categories } = useSelector((state: any) => state.categoryService);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 8; // Number of items per page

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter categories based on search query
  const filteredCategories = categories.filter((category: any) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the current items to display
  const offset = currentPage * itemsPerPage;
  const currentCategories = filteredCategories.slice(offset, offset + itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

       <div className="flex justify-between items-center mb-12">
  {/* Heading on the left side */}
  <div>
    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
      What category are you seeking help with?
    </h1>
    <p className="mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
      Browse our service categories to find the expertise you need
    </p>
  </div>

  {/* Search Bar on the right side */}
  <div className="max-w-md">
    <input
      type="text"
      placeholder="Search categories..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0); // Reset to the first page when searching
      }}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
</div>

        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 16h.01M12 13a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
            <h4 className="mt-4 text-xl font-medium text-gray-700">
              No categories found
            </h4>
            <p className="mt-2 text-gray-500">
              Please try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentCategories.map((category: any) => (
              <Link
                to={`/categories/${category._id}`}
                key={category._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group block"
              >
                {/* Reduced height for the image container */}
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {category.name}
                  </h2>
                  <div className="w-16 h-1 bg-blue-500 mb-4 rounded-full transform origin-left scale-0 group-hover:scale-100 transition-all duration-300"></div>

                  <div className="mt-4">
                    <span className="inline-flex items-center text-blue-500 group-hover:text-blue-700 font-medium">
                      Browse services
                      <svg
                        className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredCategories.length > itemsPerPage && (
          <div className="mt-12 flex justify-center">
            <ReactPaginate
              previousLabel={
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Previous
                </span>
              }
              nextLabel={
                <span className="flex items-center">
                  Next
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              }
              pageCount={Math.ceil(filteredCategories.length / itemsPerPage)}
              onPageChange={handlePageClick}
              containerClassName="flex space-x-1"
              previousLinkClassName="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              nextLinkClassName="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              pageLinkClassName="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              activeLinkClassName="!bg-blue-600 !text-white !border-blue-600"
              breakLabel="..."
              breakLinkClassName="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white"
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;