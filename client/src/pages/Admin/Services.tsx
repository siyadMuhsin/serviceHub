import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Sidebar from "../../components/Admin/Sidebar";
import Header from "../../components/Admin/Header";
import { getServices } from "../../services/Admin/service.service";


const Services: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        setServices(response.services)
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
  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      await axios.put(`/api/services/${id}/status`, {
        status: currentStatus === "Active" ? "Inactive" : "Active",
      });
      setServices((prev) =>
        prev.map((service) =>
          service.id === id ? { ...service, status: service.status === "Active" ? "Inactive" : "Active" } : service
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Filtered services for search
  const filteredServices = services.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.categoryId.name.toLowerCase().includes(filterText.toLowerCase())
  );

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
      name: "Status",
      selector: (row: any) => row.status,
      cell: (row: any) => (
        <span className={`px-2 py-1 rounded text-sm ${row.status === "Active" ? "bg-green-500" : "bg-red-500"} text-white`}>
          {row.status}
        </span>
      ),
      width: "120px",
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
      name: "Actions",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
          <button
            onClick={() => toggleStatus(row.id, row.status)}
            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            {row.status === "Active" ? "Deactivate" : "Activate"}
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
          <button className="px-4 py-2 bg-[#3F8CFF] text-white rounded hover:bg-[#2C6FD4]">Add Service</button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredServices}
          pagination
          progressPending={loading}
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
    

    </>
  );
};

export default Services;
