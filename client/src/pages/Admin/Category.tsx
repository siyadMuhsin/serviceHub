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
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

import { ConfirmationModal } from "@/components/ConfirmModal";
import {  Pagination, Stack } from "@mui/material";
import debounce from "@/Utils/debouce";
import { Category as  CategoryType } from "@/Interfaces/interfaces";



const Category: React.FC = () => {
  const [categories, setCategories] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingCategory, setEditCategory] = useState<CategoryType>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    action: '',
    variant: 'default',
    categoryId: '',
    currentStatus: false,
  });

  const limit = 5;

  const fetchCategories = async (page: number, limit: number, search: string) => {
    setIsLoading(true);
    try {
      const response = await getCategories(page, limit, search);
      if (response?.success) {
        setCategories(response.categories);
        setTotalPages(response.totalPages);
      } else {
        toast.error(response?.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(error?.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, limit, filterText);
  }, [currentPage, limit, filterText]);

  const handleSubmit = async (e: React.FormEvent, formData: FormData) => {
    setIsLoading(true);
    e.preventDefault();

    if (editingCategory) {
      try {
        const response = await edit_category(editingCategory._id, formData);
        if (response?.success) {
          toast.success(response.message);
          setCategories(prev =>
            prev.map(category =>
              category._id == editingCategory._id ? response.updatedCategory : category
            )
          );
          handleCloseModal();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error?.message || "Failed to update Category")
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
        setCategories(prev => [...prev, response.category]);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error?.message || "Error adding category" );
    } finally {
      setIsLoading(false);
    }
  };

  const showConfirmation = (category: CategoryType, action: string) => {
    setConfirmationModal({
      isOpen: true,
      title: action === 'list' ? 'List Category' : 'Unlist Category',
      description: `Are you sure you want to ${action} this category "${category.name}"?`,
      action,
      variant: action === 'unlist' ? 'destructive' : 'default',
      categoryId: category._id,
      currentStatus: category.isActive,
    });
  };
  const handleSearch=debounce((value:string)=>{
setFilterText(value)
  },500)

  const handleConfirmAction = async () => {
    setIsLoading(true);
    try {
      const response = await category_list_unlist(
        confirmationModal.categoryId, 
      );

      if (response?.success) {
        setCategories(prev =>
          prev.map(category =>
            category._id === confirmationModal.categoryId 
              ? { ...category, isActive: !confirmationModal.currentStatus } 
              : category
          )
        );
        toast.success(`Category ${confirmationModal.action}ed successfully`);
      } else {
        toast.error(response?.message || "Failed to update category status");
      }
    } catch (error) {
      toast.error(error?.message ||"Error updating category status");
    } finally {
      setIsLoading(false);
      setConfirmationModal({ ...confirmationModal, isOpen: false });
    }
  };

  const handleEditCategory = (id: string) => {
    const selectedCategory = categories.find((a: CategoryType) => a._id == id);
    setEditCategory(selectedCategory);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditCategory(null);
    setIsModalOpen(false);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#171730] text-white transition-all pt-14">
        <Sidebar onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)} />
        <main className={`p-3 md:p-5 transition-all duration-300 ${isSidebarExpanded ? "ml-16 md:ml-64" : "ml-16"}`}>
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-5">
    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-0">Category Management</h2>
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <input
        type="text"
        placeholder="Search categories..."
        defaultValue={filterText}
        onChange={(e) => handleSearch(e.target.value)}
        className="p-2 rounded bg-[#2A2A3C] text-white placeholder-gray-400 w-full"
      />
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-[#3F8CFF] text-white rounded hover:bg-[#2C6FD4] whitespace-nowrap"
      >
        Add Category
      </button>
    </div>
  </div>

  {isLoading && <Loading />}

  {/* Desktop Table View */}
  <div className="hidden md:block overflow-auto max-h-[calc(100vh-200px)]">
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
        {categories.map((category: CategoryType) => (
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
            <td className="px-6 py-4 text-sm text-white max-w-xs truncate">{category.description}</td>
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
                  className="px-3 py-1 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => showConfirmation(category, category.isActive ? 'unlist' : 'list')}
                  style={{ border: `1px solid ${category.isActive ? "#d97706" : "#10b981"}` }}
                  className={`px-3 py-1 text-white rounded text-sm ${category.isActive ? "hover:bg-yellow-600" : "hover:bg-green-600"}`}
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

  {/* Mobile Card View */}
  <div className="md:hidden space-y-3">
    {categories.map((category: CategoryType) => (
      <div key={category._id} className="bg-[#2A2A3C] rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <img
              src={category.image}
              alt={category.name}
              className="w-14 h-14 object-cover rounded-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-white">{category.name}</h3>
              <span
                style={{ border: `1px solid ${category.isActive ? "#10b981" : "#ef4444"}` }}
                className={`px-2 py-1 rounded text-xs text-white`}
              >
                {category.isActive ? "Listed" : "Unlisted"}
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-1 line-clamp-2">{category.description}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEditCategory(category._id)}
                style={{ border: "1px solid #1e40af" }}
                className="px-3 py-1 text-xs text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => showConfirmation(category, category.isActive ? 'unlist' : 'list')}
                style={{ border: `1px solid ${category.isActive ? "#d97706" : "#10b981"}` }}
                className={`px-3 py-1 text-xs text-white rounded ${category.isActive ? "hover:bg-yellow-600" : "hover:bg-green-600"}`}
              >
                {category.isActive ? "Unlist" : "List"}
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>

  <div className="mt-8 md:mt-16 flex justify-center">
    <Stack spacing={2}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        size={window.innerWidth < 768 ? "small" : "large"}
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'white',
            fontSize: window.innerWidth < 768 ? '0.75rem' : '1rem',
          },
          '& .Mui-selected': {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  </div>
</main>
      </div>

      {isModalOpen && (
        <AddCategoryModal
          handleSubmit={handleSubmit}
          isModalOpen={isModalOpen}
          setIsModalOpen={handleCloseModal}
          categoryToEdit={editingCategory}
        />
      )}

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        description={confirmationModal.description}
        confirmText={confirmationModal.action.charAt(0).toUpperCase() + confirmationModal.action.slice(1)}
        variant={confirmationModal.variant as "default"}
      />
    </>
  );
};

export default Category;