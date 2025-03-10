import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
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
import {
  addToCategories,
  toggleCategoryStatus,
  updateCategory,
} from "../../Slice/categoryServiceSlice";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

const Category: React.FC = () => {
  const { categories } = useSelector(
    (state: any) => state.categoryService
  );
  // const [categories, setCategories] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingCategory, setEditCategory] = useState<any>();
  const dispatch = useDispatch();
  // Fetch categories


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, formData: FormData) => {
    setIsLoading(true);
    e.preventDefault();
  
    if (editingCategory) {
      try {
        const response = await edit_category(editingCategory._id, formData);
  
        if (response?.success) {
          toast.success(response.message);
  
          // ✅ Update Redux store after editing
          dispatch(updateCategory(response.updatedCategory));
  
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
        
        // ✅ Update Redux store after adding
        dispatch(addToCategories(response.category));
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

  //List and unlist fuctionality
  const handleListAndUnlist = async (id: string, status: boolean) => {
    try {
      const response = await category_list_unlist(id, status); // Pass id and status

      if (response?.success) {
        console.log(`Category ${status ? "listed" : "unlisted"} successfully`);
        dispatch(toggleCategoryStatus({ id, status }));
      } else {
        console.error(response?.message || "Failed to update category status");
      }
    } catch (error) {
      console.error("Error updating category status:", error);
    }
  };
  // handle edite category
  const handleEditCategory = (id: string) => {
    const selectedCategory = categories.find((a: any) => a._id == id);
 
    setEditCategory(selectedCategory);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditCategory(null);
    setIsModalOpen(false);
  };
  // Table columns
  const columns = [
    {
      name: "Image",
      selector: (row: any) => row.image,
      cell: (row: any) => (
        <div className="relative group">
          <img
            src={row.image}
            alt={row.name}
            className="w-12 h-12 object-cover rounded-full transition-transform duration-200"
          />
          {/* Enlarged Image on Hover */}
          <div className="z-10 absolute left-0 top-0 w-32 h-32 hidden group-hover:flex justify-center items-center bg-white p-1 shadow-lg border rounded-lg">
            <img
              src={row.image}
              alt={row.name}
              className="w-full h-full object-cover rounded"
            />
          </div>
        </div>
      ),
      width: "80px",
    },
    {
      name: "Name",
      selector: (row: any) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row: any) => row.description,
      sortable: false,
      wrap: true,
    },
    {
      name: "Status",
      selector: (row: any) => row.isActive,
      cell: (row: any) => (
        <span
  style={{ border: `1px solid ${row.isActive ? "#10b981" : "#ef4444"}` }} // Dynamic border color
  className={`px-2 py-1 rounded text-sm } text-white`}
>
  {row.isActive ? "Listed" : "Unlisted"}
</span>
      ),
      width: "120px",
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex space-x-2">
 <button
  onClick={() => handleEditCategory(row._id)}
  style={{ border: "1px solid #1e40af" }} // Custom border color
  className="px-2 py-1  text-white rounded hover:bg-blue-600"
>
  Edit
</button>
<button
  onClick={() => handleListAndUnlist(row._id, row.isActive)}
  style={{ border: "1px solid #d97706" }} // Custom border color for yellow
  className="px-2 py-1  text-white rounded hover:bg-yellow-600"
>
  {row.isActive ? "Unlist" : "List"}
</button>
        </div>
      ),
      width: "200px",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1E1E2F] text-white transition-all pt-14">
        <Sidebar
          onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)}
        />
        <main
          className={`p-5 transition-all duration-300 ${
            isSidebarExpanded ? "ml-64" : "ml-16"
          }`}
        >
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
          <DataTable
            columns={columns}
            data={categories.filter((item: any) =>
              item.name.toLowerCase().includes(filterText.toLowerCase())
            )}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5,10, 20, 30]}
            highlightOnHover
            customStyles={customStyles}
          />
          </div>
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

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#2A2A3C",
      color: "#FFFFFF",
      fontSize: "14px",
      fontWeight: "bold",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  cells: {
    style: {
      backgroundColor: "#1E1E2F",
      color: "#FFFFFF",
      fontSize: "14px",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  rows: {
    style: {
      backgroundColor: "#1E1E2F",
      color: "#FFFFFF",
      "&:hover": {
        backgroundColor: "#2A2A3C",
        transition: "background-color 0.3s ease",
      },
    },
  },
  pagination: {
    style: {
      backgroundColor: "#2A2A3C",
      color: "#FFFFFF",
      fontSize: "14px",
      borderTop: "1px solid #3F3F4F",
    },
    pageButtonsStyle: {
      color: "#FFFFFF",
      fill: "#FFFFFF",
      backgroundColor: "transparent",
      "&:disabled": {
        color: "#6C6C7D",
        fill: "#6C6C7D",
      },
      "&:hover:not(:disabled)": {
        backgroundColor: "#3F8CFF",
      },
    },
  },
};

export default Category;
