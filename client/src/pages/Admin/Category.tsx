import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Header from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";
import { getCategories, addCategory } from "../../services/Admin/category.service";
import AddCategoryModal from "../../components/Admin/Modals/AddCategoryModal";

const Category: React.FC = () => {
  const [categories, setCategories] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await getCategories();
    if (response.categories) {
      setCategories(response.categories);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, formData: FormData) => {
    e.preventDefault();
    console.log("from category:",formData)
    try {
      console.log('handle submit category');
      const response = await addCategory(formData);
      if (response.success) {
        alert("Category added successfully!");
        setIsModalOpen(false);
         
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Table columns
  const columns = [
    {
      name: "Image",
      selector: (row: any) => row.image,
      cell: (row: any) => (
        <img src={row.image} alt={row.name} className="w-12 h-12 object-cover rounded" />
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
        <span className={`px-2 py-1 rounded text-sm ${row.isActive === "Listed" ? "bg-green-500" : "bg-red-500"} text-white`}>
          {row.isActive}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <button onClick={() => console.log("Edit:", row.id)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Edit
          </button>
          <button onClick={() => console.log("Toggle Status:", row.id)} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            {row.isActive === "Listed" ? "Unlist" : "List"}
          </button>
        </div>
      ),
      width: "200px",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1E1E2F] text-white transition-all">
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
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-[#3F8CFF] text-white rounded hover:bg-[#2C6FD4]">
              Add Category
            </button>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={categories.filter((item: any) => item.name.toLowerCase().includes(filterText.toLowerCase()))}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30]}
            highlightOnHover
            customStyles={{
              headCells: { style: { backgroundColor: "#2A2A3C", color: "#FFFFFF", fontSize: "14px" } },
              cells: { style: { backgroundColor: "#1E1E2F", color: "#FFFFFF", fontSize: "14px" } },
              pagination: { style: { backgroundColor: "#2A2A3C", color: "#FFFFFF" } },
            }}
          />
        </main>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <AddCategoryModal
          handleSubmit={handleSubmit}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
};

export default Category;