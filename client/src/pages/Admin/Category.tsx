import React, { useState, useEffect } from "react";
import Header from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";
import {
  getCategories,
  addCategory,
  category_list_unlist,
  edit_category,
} from "../../services/Admin/category.service";
import AddCategoryModal from "../../components/Admin/Modals/CategoryModal";
import { useSelector, useDispatch } from "react-redux";

import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

const Category: React.FC = () => {
  // const { categories } = useSelector((state: any) => state.categoryService);
  const [categories,setCategories]=useState([])
  const [filterText, setFilterText] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingCategory, setEditCategory] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const limit= 3


  // Fetch categories with pagination and search
  const fetchCategories = async (page: number, limit: number, search: string) => {
    setIsLoading(true);
    try {
      console.log(search)
      const response = await getCategories(page, limit, search);
      console.log(response)
      if (response?.success) {
        
        setCategories(response.categories)
        setTotalPages(response.totalPages);
      } else {
        toast.error(response?.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, limit, filterText);
  }, [currentPage, limit, filterText]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, formData: FormData) => {
    setIsLoading(true);
    e.preventDefault();

    if (editingCategory) {
      try {
        const response = await edit_category(editingCategory._id, formData);

        if (response?.success) {
          toast.success(response.message);
         setCategories(prev=>
          prev.map(category=>
            category._id==editingCategory._id ? category=response.updatedCategory :category
          )
         )
          handleCloseModal();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to update category");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const response = await addCategory(formData);
      if (response.success) {
        toast.success("Category added successfully");
        setIsModalOpen(false);
        setCategories(prev=>
        [...prev,response.category]
        )
        
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      console.log("Error adding category:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // List and unlist functionality
  const handleListAndUnlist = async (id: string, status: boolean) => {
    try {
      const response = await category_list_unlist(id, status);

      if (response?.success) {
        console.log(`Category ${status ? "listed" : "unlisted"} successfully`);
        setCategories((prev) =>
          prev.map((category) =>
            category._id === id ? { ...category, isActive: !status } : category
          )
        );
       
      } else {
        console.error(response?.message || "Failed to update category status");
      }
    } catch (error) {
      console.error("Error updating category status:", error);
    }
  };

  // Handle edit category
  const handleEditCategory = (id: string) => {
    const selectedCategory = categories.find((a: any) => a._id == id);
    setEditCategory(selectedCategory);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditCategory(null);
    setIsModalOpen(false);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1E1E2F] text-white transition-all pt-14">
        <Sidebar onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)} />
        <main className={`p-5 transition-all duration-300 ${isSidebarExpanded ? "ml-64" : "ml-16"}`}>
          <h2 className="text-2xl font-bold mb-5">Category Management</h2>

          {/* Search and Add Category Buttons */}
          <div className="flex justify-between mb-5">
            <input
              type="text"
              placeholder="Search categories..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="p-2 rounded bg-[#2A2A3C] text-white placeholder-gray-400"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#3F8CFF] text-white rounded hover:bg-[#2C6FD4]"
            >
              Add Category
            </button>
          </div>

          {/* Table */}
          {isLoading && <Loading />}
          <div className="overflow-auto max-h-[calc(100vh-200px)]">
            <table className="min-w-full bg-[#2A2A3C] rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-[#2A2A3C] text-left text-xs font-medium text-white uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 bg-[#2A2A3C] text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 bg-[#2A2A3C] text-left text-xs font-medium text-white uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 bg-[#2A2A3C] text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 bg-[#2A2A3C] text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#1E1E2F] divide-y divide-[#2A2A3C]">
                {categories.map((category: any) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative group">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded-full transition-transform duration-200"
                        />
                        <div className="z-10 absolute left-0 top-0 w-32 h-32 hidden group-hover:flex justify-center items-center bg-white p-1 shadow-lg border rounded-lg">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-white">{category.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <span
                        style={{ border: `1px solid ${category.isActive ? "#10b981" : "#ef4444"}` }}
                        className={`px-2 py-1 rounded text-sm text-white`}
                      >
                        {category.isActive ? "Listed" : "Unlisted"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCategory(category._id)}
                          style={{ border: "1px solid #1e40af" }}
                          className="px-2 py-1 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleListAndUnlist(category._id, category.isActive)}
                          style={{ border: "1px solid #d97706" }}
                          className="px-2 py-1 text-white rounded hover:bg-yellow-600"
                        >
                          {category.isActive ? "Unlist" : "List"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <AddCategoryModal
          handleSubmit={handleSubmit}
          isModalOpen={isModalOpen}
          setIsModalOpen={handleCloseModal}
          categoryToEdit={editingCategory}
        />
      )}
    </>
  );
};

export default Category;