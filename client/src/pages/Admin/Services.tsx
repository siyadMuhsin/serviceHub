import React, { useState, useEffect } from "react";

import DataTable from "react-data-table-component";
import Sidebar from "../../components/Admin/Sidebar";
import Header from "../../components/Admin/Header";
import { edit_service, getServices, service_list_unlist } from "../../services/Admin/service.service";
import AddServiceModal from "../../components/Admin/Modals/ServiceModal";
import { add_service } from "../../services/Admin/service.service";
import { useDispatch, useSelector } from "react-redux";
import { addToServices, setInitialServices, toggleServiceStatus, updateService } from "../../Slice/categoryServiceSlice";
import { toast } from "react-toastify";
import { RootState } from "@reduxjs/toolkit/query";
import Loading from "../../components/Loading";

const Services: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen,setIsModalOpen]=useState<boolean>(false)
  const [editService,setEditService]=useState()
  const {services}=useSelector((state:any)=>state.categoryService)
const dispatch=useDispatch()
  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        
        dispatch(setInitialServices(response.services))
        // setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Handle status toggle
  const toggleListStatus = async (id: string, isListed: boolean) => {
    try {
      setLoading(true)
      const response= await service_list_unlist(id)
      if(response?.success){
        toast.success(response.message)
        dispatch(toggleServiceStatus({id,status:isListed}))
      }else{
        toast.error(response?.message || "Failed to update status");

      }
      
  
      console.log(`Category ${isListed ? "listed" : "unlisted"} successfully`);
    } catch (error:any) {
      console.error("Error updating list status:", error);
      toast.error(error.message ||"Something went wrong. Please try again.");
    }finally{
      setLoading(false)
    }
  };


  //submit form ;
  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
  
      let response;
      
      if (editService) {
        // Editing an existing service
        response = await edit_service(editService._id, formData);
        if (response?.success) {
          dispatch(updateService(response.service));
          toast.success("Service updated successfully!");
        } else {
          toast.error(response?.message || "Failed to update service.");
        }
      } else {
        // Adding a new service
        response = await add_service(formData);
        if (response?.success) {
          dispatch(addToServices(response.service));
          toast.success(response.message || "Service added successfully!");
        } else {
          toast.error(response?.message || "Failed to add service.");
        }
      }
    } catch (error: any) {
      console.error("Service operation error:", error);
      toast.error(error?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  // Filtered services for search
  const filteredServices = services.filter(
    (item:any) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.categoryId.name.toLowerCase().includes(filterText.toLowerCase())
  );


  const handleEdit=(data)=>{
    console.log(data)
    setEditService(data)
    setIsModalOpen(true)

  }
  const handleCloseModal=()=>{
    setEditService(null)
    setIsModalOpen(false)

  }
  // Table columns
  const columns = [
    {
      name: "Image",
      cell: (row: any) => <img src={row.image} alt={row.name} className="w-10 h-10 rounded-full" />,
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
    },{
      name: "Status",
      selector: (row: any) => row.status,
      cell: (row: any) => (
        <span
          className={`px-2 py-1 rounded text-sm ${row.isActive?"bg-green-500" : "bg-red-500"} text-white`}
        >
          {row.isActive ?'Active':'Deactive'}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <button onClick={()=>handleEdit(row)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
          <button
            onClick={() => toggleListStatus(row._id, row.isActive)}
            className={`px-2 py-1 rounded text-white ${
              row.isActive ? "bg-gray-500 hover:bg-gray-600" : "bg-green-500 hover:bg-green-600"
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
      <Sidebar onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)} />
      <main className={`transition-all duration-300 ${isSidebarExpanded ? "ml-64" : "ml-16"} mt-16 p-5`}>
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
          <button onClick={()=>setIsModalOpen(true)} className="px-4 py-2 bg-[#3F8CFF] text-white rounded hover:bg-[#2C6FD4]">Add Service</button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredServices}
          pagination
          // progressPending={loading}
          highlightOnHover
          customStyles={{
            headCells: {
              style: { backgroundColor: "#2A2A3C", color: "#FFFFFF", fontSize: "14px" },
            },
            cells: {
              style: { backgroundColor: "#1E1E2F", color: "#FFFFFF", fontSize: "14px" },
            },
            pagination: {
              style: { backgroundColor: "#2A2A3C", color: "#FFFFFF" },
            },
          }}
        
      
        />
      </main>
    </div>
    {isModalOpen && (
  <AddServiceModal 
    isOpen={isModalOpen} 
    onClose={() => handleCloseModal()}  // ✅ Corrected onClose function
    onSave={handleSubmit} 
    serviceToEdit={editService}
  />
)}

{loading&&<Loading/>}
    </>
  );
};

export default Services;
