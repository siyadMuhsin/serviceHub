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

import { ConfirmationModal } from "@/components/ConfirmModal";
import { Pagination, Stack } from "@mui/material";
import debounce from "@/Utils/debouce";


const Services: React.FC = () => {
  const [services, setServices] = useState([]);
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    action: '',
    variant: 'default' ,
    serviceId: '',
    currentStatus: false,
  });
  const dispatch = useDispatch();
  const limit = 5;

  const fetchServices = async (page: number, limit: number, search: string = "") => {
    try {
      setLoading(true);
      const response = await getServices(page, limit, search);
      if (response?.success) {
        setServices(response.services);
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

  const showConfirmation = (service: any, action: string) => {
    setConfirmationModal({
      isOpen: true,
      title: action === 'list' ? 'List Service' : 'Unlist Service',
      description: `Are you sure you want to ${action} this service "${service.name}"?`,
      action,
      variant: action === 'unlist' ? 'destructive' : 'default',
      serviceId: service._id,
      currentStatus: service.isActive,
    });
  };

  const handleConfirmAction = async () => {
    setLoading(true);
    try {
      const response = await service_list_unlist(confirmationModal.serviceId);
      if (response?.success) {
        setServices(prev =>
          prev.map(service =>
            service._id === confirmationModal.serviceId 
              ? { ...service, isActive: !confirmationModal.currentStatus } 
              : service
          )
        );
        setSnackbar({ 
          open: true, 
          message: `Service ${confirmationModal.action}ed successfully`, 
          severity: "success" 
        });
      } else {
        setSnackbar({ 
          open: true, 
          message: response?.message || "Failed to update status", 
          severity: "error" 
        });
      }
    } catch (error: any) {
      setSnackbar({ 
        open: true, 
        message: error.message || "Something went wrong", 
        severity: "error" 
      });
    } finally {
      setLoading(false);
      setConfirmationModal({ ...confirmationModal, isOpen: false });
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      let response;
      if (editService) {
        response = await edit_service(editService._id, formData);
        if (response?.success) {
          setServices(prev =>
            prev.map(service =>
              service._id == editService._id ? response.service : service
            )
          );
          setSnackbar({ open: true, message: "Service updated successfully!", severity: "success" });
        } else {
          setSnackbar({ open: true, message: response?.message || "Failed to update service.", severity: "error" });
        }
      } else {
        response = await add_service(formData);
        if (response?.success) {
          setServices(prev => [...prev, response.service]);
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

  const handleEdit = (data: any) => {
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
const handleSearch=debounce((value:string)=>{
  setFilterText(value)
},500)
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#171730] text-white transition-all">
        <Sidebar onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)} />
        <main className={`transition-all duration-300 ${isSidebarExpanded ? "ml-64" : "ml-16"} pt-16 p-3 md:p-5`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-5">
          <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-0">Service Management</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search services..."
              defaultValue={filterText}
              onChange={(e) => handleSearch(e.target.value)}
              className="p-2 rounded bg-[#2A2A3C] text-white placeholder-gray-400 w-full"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#3F8CFF] text-white rounded hover:bg-[#2C6FD4] whitespace-nowrap"
            >
              Add Service
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-auto max-h-[calc(100vh-200px)]">
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
                  <td className="px-6 py-4 text-sm text-white max-w-xs truncate">{service.description}</td>
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
                        style={{ border: `1px solid ${service.isActive ? "#d97706" : "#10b981"}` }}
                        onClick={() => showConfirmation(service, service.isActive ? 'unlist' : 'list')}
                        className={`px-2 py-1 rounded text-white ${
                          service.isActive ? "hover:bg-red-600" : "hover:bg-green-600"
                        }`}
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

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {services.map((service: any) => (
            <div key={service._id} className="bg-[#2A2A3C] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white">{service.name}</h4>
                    <span
                      style={{ border: `1px solid ${service.isActive ? "#10b981" : "#ef4444"}` }}
                      className={`px-2 py-1 rounded text-xs text-white`}
                    >
                      {service.isActive ? "Listed" : "Unlisted"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{service.categoryId.name}</p>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">{service.description}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      style={{ border: "2px solid #1e40af" }}
                      onClick={() => handleEdit(service)}
                      className="px-3 py-1 text-xs text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      style={{ border: `1px solid ${service.isActive ? "#d97706" : "#10b981"}` }}
                      onClick={() => showConfirmation(service, service.isActive ? 'unlist' : 'list')}
                      className={`px-3 py-1 text-xs rounded text-white ${
                        service.isActive ? "hover:bg-red-600" : "hover:bg-green-600"
                      }`}
                    >
                      {service.isActive ? "Unlist" : "List"}
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
        <AddServiceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSubmit}
          serviceToEdit={editService}
        />
      )}

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        description={confirmationModal.description}
        confirmText={confirmationModal.action.charAt(0).toUpperCase() + confirmationModal.action.slice(1)}
        variant={confirmationModal.variant}
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {loading && <Loading />}
    </>
  );
};

export default Services;