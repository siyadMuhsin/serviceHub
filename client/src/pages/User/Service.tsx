import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { get_servicesByCategory_limit } from "../../services/category.service";
import debounce from "../../Utils/debouce";

const Service: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  const [totalPages, setTotalPages] = useState<number>(0);

  // ✅ Debounced search handler
  const debouncedSetSearchQuery = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setCurrentPage(1); // Reset to page 1 when searching
    }, 300),
    []
  );

  // ✅ Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSetSearchQuery(value);
  };

  // ✅ Fetch services from the backend
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await get_servicesByCategory_limit(
        id,
        currentPage,
        itemsPerPage,
        searchQuery
      );
      if (response.success) {
        console.log('success',response.services)
        setServices(response.services || []);
        setTotalPages(response.totalPages || 0);
      } else {
        setError(response.message || "Failed to fetch services.");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setError("Failed to fetch services. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Trigger fetching when category ID, page, or search query changes
  useEffect(() => {
    fetchServices();
  }, [id, currentPage, searchQuery]);

  // ✅ Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Services in This Category
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Browse our selection of professional services tailored to your needs.
            </p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search services..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* ✅ Show loading state */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading services...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : services.length === 0 ? (
          <div className="text-center text-gray-500">No services found.</div>
        ) : (
          <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {services.map((service) => (
        <div
          key={service._id}
          className="relative overflow-hidden rounded-lg shadow-md"
        >
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-44 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white font-bold text-lg text-center">{service.name}</p>
          </div>
        </div>
      ))}
    </div>

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Service;
