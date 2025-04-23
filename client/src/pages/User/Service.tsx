import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { get_servicesByCategory_limit } from "../../services/category.service";
import debounce from "@/Utils/debouce";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Bookmark, BookmarkCheck } from "lucide-react";
import { saveService, unsaveService } from "@/services/User/profile.service";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/Slice/authSlice";

const Service: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: any) => state.auth);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [savedServices, setSavedServices] = useState<Set<string>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  const [totalPages, setTotalPages] = useState<number>(0);
  const dispatch = useDispatch();

  // Debounced search handler
  const debouncedSetSearchQuery = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setCurrentPage(1); // Reset to page 1 when searching
    }, 400),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSetSearchQuery(value);
  };

  // Fetch services from the backend
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
        setServices(response.services || []);
        setTotalPages(response.totalPages || 0);
        
        // Initialize saved services state from user's saved services in Redux
        if (user?.savedServices) {
          setSavedServices(new Set(user.savedServices));
        }
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

  // Trigger fetching when category ID, page, or search query changes
  useEffect(() => {
    fetchServices();
  }, [id, currentPage, searchQuery]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveToggle = async (serviceId: string) => {
    try {
      const isCurrentlySaved = savedServices.has(serviceId);
      
      if (isCurrentlySaved) {
        // Unsave the service
        const response = await unsaveService(serviceId);
        if (response.success) {
          // Update local state
          setSavedServices(prev => {
            const newSet = new Set(prev);
            newSet.delete(serviceId);
            return newSet;
          });
          
          // Update Redux store
          dispatch(updateUser({
            savedServices: Array.from(savedServices).filter(id => id !== serviceId)
          }));
        }
      } else {
        // Save the service
        const response = await saveService(serviceId);
        if (response.success) {
          // Update local state
          setSavedServices(prev => new Set(prev).add(serviceId));
          
          // Update Redux store
          dispatch(updateUser({
            savedServices: [...Array.from(savedServices), serviceId]
          }));
        }
      }
      
      // Update the local services state to reflect the change
      setServices(prev => prev.map(service => 
        service._id === serviceId 
          ? { ...service, isSaved: !isCurrentlySaved } 
          : service
      ));
      
    } catch (error) {
      console.error('Error toggling save status:', error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with consistent styling to match Category page */}
        <div className="flex justify-between">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Services Available
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Explore professional services tailored to meet your specific requirements
            </p>
          </div>
          
          {/* Search Input with Icon - consistent with Category page */}
          <div className="mt-8 max-w-md relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchInput}
                onChange={handleSearchChange}
                className="pl-10 py-6 rounded-full border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
          </div>
        </div>

        {/* Services List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <Card className="max-w-md mx-auto bg-white">
            <CardContent className="flex flex-col items-center justify-center pt-10 pb-10">
              <div className="text-red-500 mb-4">⚠️</div>
              <h4 className="text-xl font-medium text-gray-700">
                Error
              </h4>
              <p className="mt-2 text-gray-500 text-center">
                {error}
              </p>
            </CardContent>
          </Card>
        ) : services.length === 0 ? (
          <Card className="max-w-md mx-auto bg-white">
            <CardContent className="flex flex-col items-center justify-center pt-10 pb-10">
              <Search size={48} className="text-gray-300 mb-4" />
              <h4 className="text-xl font-medium text-gray-700">
                No services found
              </h4>
              <p className="mt-2 text-gray-500 text-center">
                Please try a different search term.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service._id} className="relative group">
                <Link
                  to={`/services/${service._id}`}
                  className="group outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                >
                  <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-8px] h-full flex flex-col">
                    {/* Image with overlay effect - matching Category styling */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    <CardHeader className="pt-6 pb-2">
                      <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </h2>
                    </CardHeader>
                    
                    <CardContent className="py-2 flex-grow">
                      <p className="text-gray-600 line-clamp-3">
                        {service.description || "Professional service tailored to meet your specific requirements."}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="pt-2 pb-6">
                      <div className="text-sm text-blue-600 font-medium flex items-center">
                        View experts
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
                
                {/* Save button positioned absolutely in the top right of the card */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveToggle(service._id);
                  }}
                  className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-colors"
                  aria-label={savedServices.has(service._id) ? "Unsave service" : "Save service"}
                >
                  {savedServices.has(service._id) ? (
                    <BookmarkCheck className="text-blue-600 fill-current" size={20} />
                  ) : (
                    <Bookmark className="text-gray-600" size={20} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - positioned consistently with Category page */}
        {services.length > 0 && totalPages > 1 && (
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

export default Service;