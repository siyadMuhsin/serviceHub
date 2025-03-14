import React, { useState, useEffect, act } from "react";
import axios from "axios";
import Header from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";
import Pagination from "../../components/Pagination";
import {
  block_unlbock_expert,
  expert_change_action,
  get_experts,
} from "../../services/Admin/expert.service";
import Loading from "../../components/Loading";

interface Expert {
  _id?: string;
  accountName: string;
  categoryId: { name: string };
  serviceId?: { name: string };
  userId: { name: string; email: string };
  experience?: number;
  subscription: string;
  contact: string;
  isActive:boolean;
  status?: string;
}

function ExpertManagement() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const itemsPerPage = 8;

  // Fetch experts
  useEffect(() => {
    setLoading(true);
    const fetchExperts = async () => {
      try {
        const response = await get_experts(currentPage, itemsPerPage, filter);
        if (response.success) {
          console.log(response.experts);
          setExperts(response.experts || []);
          setTotalPage(response.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching experts:", error);
      }
    };

    fetchExperts();
    setLoading(false);
  }, [currentPage, filter]);

  const handleFilterChange = (status: string) => {
    setFilter(status);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    console.log(page);
    setCurrentPage(page);
  };
  const handleStatusChange = async (id: string, action: string) => {
    setLoading(true);
    try {
      const response = await expert_change_action(id, action);
      if (response.success) {
        setExperts((prev) =>
          prev.map((expert) =>
            expert._id === id ? { ...expert, status: action } : expert
          )
        );
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };


  const handleBlockUnblock=async(id:string,active:boolean)=>{
    try {
      setLoading(true)
      const response= await block_unlbock_expert(id,active)
      if(response.success){
        setExperts((prev)=>
          prev.map((expert)=>(
            expert._id===id ? {...expert,isActive:!active}:expert
          ))
        )
      }
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }

  }
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1E1E2F] text-white transition-all pt-14">
        <Sidebar
          onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)}
        />
        <div className={`p-6 ${isSidebarExpanded ? "ml-64" : "ml-20"}`}>
          <h2 className="text-2xl font-semibold mb-4">Expert Management</h2>

          {/* Filter Options */}
          <div className="mb-4 space-x-2">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-4 py-2 rounded ${
                  filter === status ? "bg-blue-500" : "bg-gray-700"
                } hover:bg-blue-600 transition`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-600">
              <thead>
                <tr className="bg-[#2C2C3E]">
                  <th className="border border-gray-500 px-4 py-2">Name</th>
                  <th className="border border-gray-500 px-4 py-2">Email</th>
                  <th className="border border-gray-500 px-4 py-2">Contact</th>
                  <th className="border border-gray-500 px-4 py-2">Status</th>
                  <th className="border border-gray-500 px-4 py-2">Actions</th>
                  <th className="border border-gray-500 px-4 py-2">View</th>
                </tr>
              </thead>
              <tbody>
                {experts.map((expert) => (
                  <tr key={expert._id} className="hover:bg-[#333345]">
                    <td className="border border-gray-500 px-4 py-2">
                      {expert.accountName}
                    </td>
                    <td className="border border-gray-500 px-4 py-2">
                      {expert.userId.email}
                    </td>
                    <td className="border border-gray-500 px-4 py-2">
                      {expert.contact}
                    </td>

                    <td className="border border-gray-500 px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          expert.status === "pending"
                            ? "bg-yellow-500"
                            : expert.status === "approved"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {expert.status === "approved"
                          ? `${expert.subscription || "No subscription"})`
                          : expert.status}
                      </span>
                    </td>
                    <td className="border border-gray-500 px-4 py-2 space-x-2">
                      {expert.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(expert._id, "approved")
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(expert._id, "rejected")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {expert.status === "approved" && (
                        <div>
                          {/* "#10b981" : "#ef4444" */}
                          {expert.isActive ? (
                            <button
                            onClick={()=>handleBlockUnblock(expert._id,expert.isActive)}
                              style={{ border: "1px solid #ef4444" }} // Custom border color
                              className="px-2 py-1  text-white rounded hover:bg-red-600"
                            >
                              block
                            </button>
                          ) : (
                            <button
                            onClick={()=>handleBlockUnblock(expert._id,expert.isActive)}
                              style={{ border: "1px solid #10b981" }} // Custom border color
                              className="px-2 py-1  text-white rounded hover:bg-green-600"
                            >
                              unlock
                            </button>
                          )}
                        </div>

                        // <span className="text-green-400">Approved</span>
                      )}
                      {expert.status === "rejected" && (
                        <span className="text-red-400">Rejected</span>
                      )}
                    </td>
                    <td className="border border-gray-500 px-4 py-2 space-x-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {experts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          {loading && <Loading />}
        </div>
      </div>
    </>
  );
}

export default ExpertManagement;
