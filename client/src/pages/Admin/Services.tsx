import React, { useState, useEffect } from "react";
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

import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

const Services: React.FC = () => {
  const [services,setServices]=useState([])
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editService, setEditService] = useState<any>();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [totalPages, setTotalPages] = useState<number>(1);
  const dispatch = useDispatch();
  const limit= 5

  // Fetch services with pagination and search
  const fetchServices = async (page: number, limit: number, search: string = "") => {
    try {
      setLoading(true);
      const response = await getServices(page, limit, search);
      console.log(response)
      if (response?.success) {
        setServices(response.services)
        setTotalPages(response.totalPage);
      } else {
        setSnackbar({ open: true, message: response?.message || "Failed to fetch services", severity: "error" });
      }
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || "Something went wrong. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(currentPage, limit, filterText);
  }, [currentPage, limit, filterText]);

  // Handle status toggle
  const toggleListStatus = async (id: string, isListed: boolean) => {
    console.log(isListed)
    try {
      setLoading(true);
      const response = await service_list_unlist(id);
      if (response?.success) {
        setSnackbar({ open: true, message: response.message, severity: "success" })
        setServices(prev=>
          prev.map(service=>
            service._id==id ? {...service,isActive:!isListed}:service 
          )
        )
      
      } else {
        setSnackbar({ open: true, message: response?.message || "Failed to update status", severity: "error" });
      }
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || "Something went wrong. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      let response;
      if (editService) {
        response = await edit_service(editService._id, formData);
        console.log(response)
        if (response?.success) {
          setServices(prev=>
            prev.map(service=>
              service._id==editService._id ? response.service :service
            )
          )
          setSnackbar({ open: true, message: "Service updated successfully!", severity: "success" });
        } else {
          setSnackbar({ open: true, message: response?.message || "Failed to update service.", severity: "error" });
        }
      } else {
        response = await add_service(formData);
        if (response?.success) {
          setServices(prev=>
          [...prev,response.service]
          )
          
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

  // Handle edit
  const handleEdit = (data: any) => {
    setEditService(data);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setEditService(null);
    setIsModalOpen(false);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1E1E2F] text-white transition-all">
        <Sidebar onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)} />
        <main className={`transition-all duration-300 ${isSidebarExpanded ? "ml-64" : "ml-16"} pt-16 p-5`}>
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
            <table className="min-w-full bg-[#2A2A3C] rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-[#2A2A3C] text-left text-xs font-medium text-white uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 bg-[#2A2A3C] text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 bg-[#2A2A3C] text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 bg-[#2A2A3C] text-left text-xs font-medium text-white uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 bg-[#2A2A3C] text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 bg-[#2A2A3C] text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#1E1E2F] divide-y divide-[#2A2A3C]">
                {services.map((service: any) => (
                  <tr key={service._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative group inline-block">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-10 h-10 rounded-full transition-transform duration-200"
                        />
                        <div className="absolute left-0 top-0 w-32 h-32 hidden group-hover:flex justify-center items-center bg-white p-1 shadow-lg border rounded z-20">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{service.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{service.categoryId.name}</td>
                    <td className="px-6 py-4 text-sm text-white">{service.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <span
                        style={{ border: `1px solid ${service.isActive ? "#10b981" : "#ef4444"}` }}
                        className={`px-2 py-1 rounded text-sm text-white`}
                      >
                        {service.isActive ? "Listed" : "Unlisted"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <div className="flex space-x-2">
                        <button
                          style={{ border: "2px solid #1e40af" }}
                          onClick={() => handleEdit(service)}
                          className="px-2 py-1 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          style={{ border: "1px solid #d97706" }}
                          onClick={() => toggleListStatus(service._id, service.isActive)}
                          className={`px-2 py-1 rounded text-white ${service.isActive ? "hover:bg-red-600" : "hover:bg-green-600"}`}
                        >
                          {service.isActive ? "Unlist" : "List"}
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

      {/* Add Service Modal */}
      {isModalOpen && (
        <AddServiceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSubmit}
          serviceToEdit={editService}
        />
      )}

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loading */}
      {loading && <Loading />}
    </>
  );
};

export default Services;