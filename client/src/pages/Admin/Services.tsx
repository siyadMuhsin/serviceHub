import React, { useState, useEffect } from "react";

import DataTable from "react-data-table-component";
import Sidebar from "../../components/Admin/Sidebar";
import Header from "../../components/Admin/Header";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  edit_service,
  getServices,
  service_list_unlist,
} from "../../services/Admin/service.service";
import AddServiceModal from "../../components/Admin/Modals/ServiceModal";
import { add_service } from "../../services/Admin/service.service";
import { useDispatch, useSelector } from "react-redux";
import {
  addToServices,
  setInitialServices,
  toggleServiceStatus,
  updateService,
} from "../../Slice/categoryServiceSlice";
import Loading from "../../components/Loading";

const Services: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editService, setEditService] = useState<any>();
  const { services } = useSelector((state: any) => state.categoryService);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });
  const dispatch = useDispatch();

  // Handle status toggle
  const toggleListStatus = async (id: string, isListed: boolean) => {
    try {
      setLoading(true);
      const response = await service_list_unlist(id);
      if (response?.success) {
        setSnackbar({ open: true, message: response.message, severity: "success" });
        dispatch(toggleServiceStatus({ id, status: isListed }));
      } else {
        setSnackbar({ open: true, message: response?.message || "Failed to update status", severity: "error" });
      }
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || "Something went wrong. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  //submit form ;
  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      let response;
      if (editService) {
        response = await edit_service(editService._id, formData);
        if (response?.success) {
          dispatch(updateService(response.service));
          setSnackbar({ open: true, message: "Service updated successfully!", severity: "success" });
        } else {
          setSnackbar({ open: true, message: response?.message || "Failed to update service.", severity: "error" });
        }
      } else {
        response = await add_service(formData);
        if (response?.success) {
          dispatch(addToServices(response.service));
          setSnackbar({ open: true, message: response.message || "Service added successfully!", severity: "success" });
        } else {
          setSnackbar({ open: true, message: response?.message || "Failed to add service.", severity: "error" });
        }
      }
    } catch (error: any) {
      setSnackbar({ open: true, message: error?.message || "An unexpected error occurred.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };
  // Filtered services for search
  const filteredServices = services.filter(
    (item: any) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.categoryId.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleEdit = (data:any) => {
    setEditService(data);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setEditService(null);
    setIsModalOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Table columns
  const columns = [
    {
      name: "Image",
      cell: (row: any) => (
        <div className="relative group inline-block">
          {/* Small Image */}
          <img
            src={row.image}
            alt={row.name}
            className="w-10 h-10 rounded-full transition-transform duration-200"
          />
          
          {/* Enlarged Image on Hover */}
          <div className="absolute left-0 top-0 w-32 h-32 hidden group-hover:flex justify-center items-center bg-white p-1 shadow-lg border rounded z-20">
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
      name: "Category",
      selector: (row: any) => row.categoryId.name,

      sortable: true,
    },
    {
      name: "Description",
      selector: (row: any) => row.description,
      wrap: true,
    },
    {
      name: "Status",
      selector: (row: any) => row.status,
      cell: (row: any) => (
        <span
        style={{ border: `1px solid ${row.isActive ? "#10b981" : "#ef4444"}` }} // Dynamic border color
        className={`px-2 py-1 rounded text-sm text-white`}
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
           style={{ border: "2px solid #1e40af" }}
            onClick={() => handleEdit(row)}
            className="px-2 py-1  text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
           style={{ border: "1px solid #d97706" }}
            onClick={() => toggleListStatus(row._id, row.isActive)}
            className={`px-2 py-1 rounded text-white ${
              row.isActive
                ? " hover:bg-red-600"
                : " hover:bg-green-600"
            }`}
          >
            {row.isActive ? "Unlist" : "List"}
          </button>
        </div>
      ),
      width: "250px",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1E1E2F] text-white transition-all">
        <Sidebar
          onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)}
        />
        <main
          className={`transition-all duration-300 ${
            isSidebarExpanded ? "ml-64" : "ml-16"
          } pt-16 p-5`}
        >
          <h3 className="text-2xl font-bold mb-5">Service Management</h3>

          {/* Search and Add Service */}
          <div className="flex justify-between mb-5">
            <input
              type="text"
              placeholder="Search services..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="p-2 rounded bg-[#2A2A3C] text-white placeholder-gray-400"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#3F8CFF] text-white rounded hover:bg-[#2C6FD4]"
            >
              Add Service
            </button>
          </div>

          {/* Table */}
          <div className="overflow-auto max-h-[calc(100vh-200px)]">
            <DataTable
              columns={columns}
              data={filteredServices}
              pagination
              highlightOnHover
              customStyles={customStyles}
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15, 20]}
              noDataComponent={<div className="p-4 text-white">No data available</div>}
            />
          </div>
        </main>
      </div>
      {isModalOpen && (
        <AddServiceModal
          isOpen={isModalOpen}
          onClose={() => handleCloseModal()} // ✅ Corrected onClose function
          onSave={handleSubmit}
          serviceToEdit={editService}
        />
      )} 
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {loading && <Loading />}
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
export default Services;
