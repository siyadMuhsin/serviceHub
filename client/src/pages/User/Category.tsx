import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get_categoryBy_limit } from "../../services/category.service";
import Pagination from "../../components/Pagination"; // Import the custom Pagination component
import debounce from "../../Utils/debouce"; // Import the debounce utility


const Category: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 8;

  // Fetch categories with debounced search
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get_categoryBy_limit(currentPage, itemsPerPage, searchQuery);
        setCategories(response.categories || []);
        setTotalPages(response.totalPages || 0);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchData();
  }, [currentPage, searchQuery]); // Refetch when currentPage or searchQuery changes

  // Debounced search handler
  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value);
    setCurrentPage(0); // Reset to the first page when searching
  }, 300); // 300ms delay

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What category are you seeking help with?
            </h1>
            <p className="mt-3 max-w-2xl text-xl text-gray-500">
              Browse our service categories to find the expertise you need
            </p>
          </div>
          {/* Search Input */}
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search categories..."
              defaultValue={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Categories List */}
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm">
            <h4 className="mt-4 text-xl font-medium text-gray-700">
              No categories found
            </h4>
            <p className="mt-2 text-gray-500">
              Please try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                to={`/categories/${category._id}`}
                key={category._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 ">
                    {category.name}
                  </h2>
                
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Custom Pagination */}
        {categories.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Category;