import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get_categoryBy_limit } from "../../services/category.service";
import Pagination from "../../components/Pagination";
import debounce from "../../Utils/debouce";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
  }, [currentPage, searchQuery]);

  // Debounced search handler
  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value);
    setCurrentPage(0); // Reset to the first page when searching
  }, 300);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with improved styling */}
        <div className=" flex justify-between">
          <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Find Your Expert
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Browse our service categories to find the expertise you need
          </p>

          </div>
         

          {/* Search Input with Icon */}
          <div className="mt-8 max-w-md  relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search categories..."
                defaultValue={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 py-6 rounded-full border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
          </div>
        </div>

        {/* Categories List with shadcn Cards */}
        {categories.length === 0 ? (
          <Card className="max-w-md mx-auto bg-white">
            <CardContent className="flex flex-col items-center justify-center pt-10 pb-10">
              <Search size={48} className="text-gray-300 mb-4" />
              <h4 className="text-xl font-medium text-gray-700">
                No categories found
              </h4>
              <p className="mt-2 text-gray-500 text-center">
                Please try a different search term.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                to={`/categories/${category._id}`}
                key={category._id}
                className="group outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
              >
                <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-8px] h-full flex flex-col">
                  {/* Image with overlay effect */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  <CardHeader className="pt-6 pb-2">
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h2>
                  </CardHeader>
                  
                  <CardContent className="py-2 flex-grow">
                    <p className="text-gray-600 line-clamp-3">
                      {category.description || "Discover expert services tailored to your needs in this category."}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-2 pb-6">
                    <div className="text-sm text-blue-600 font-medium flex items-center">
                      Explore services
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination - positioned better */}
        {categories.length > 0 && (
          <div className="mt-16">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
