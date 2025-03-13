import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Admin/Header';
import Sidebar from '../../components/Admin/Sidebar';
import Pagination from '../../components/Pagination';
import { get_experts } from '../../services/Admin/expert.service';

interface Expert {
  _id?: string;
  accountName: string;
  categoryId: {name:string};
  serviceId?: {name:string};
  userId:{name:string,email:string}
  experience?: number;
  subscription:string
  contact:string
  status?: string;
}

function ExpertManagement() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage,setTotalPage]=useState<number>()
  const itemsPerPage = 5;

  // Fetch experts
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await get_experts(currentPage,itemsPerPage,filter);
        if(response.success){
            console.log(response.experts)
            setExperts(response.experts)
            setTotalPage(response.totalRecords)
            
        }
      } catch (error) {
        console.error('Error fetching experts:', error);
      }
    };

    fetchExperts();
  }, [currentPage,filter]);



//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentExperts = filteredExperts.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (status: string) => {
  
    setFilter(status);
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1E1E2F] text-white transition-all pt-14">
        <Sidebar onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)} />
        <div className={`p-6 ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
          <h2 className="text-2xl font-semibold mb-4">Expert Management</h2>

          {/* Filter Options */}
          <div className="mb-4 space-x-2">
            {["all", "pending", "approved", "rejected"].map(status => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-4 py-2 rounded ${filter === status ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-blue-600 transition`}
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
                 
                 <th className="border border-gray-500 px-4 py-2">Subscrictipion</th>
                 
                
                  <th className="border border-gray-500 px-4 py-2">Status</th>
                  <th className="border border-gray-500 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {experts.map((expert) => (
                  <tr key={expert._id} className="hover:bg-[#333345]">
                    <td className="border border-gray-500 px-4 py-2">{expert.accountName}</td>
                    <td className="border border-gray-500 px-4 py-2">{expert.userId.email}</td>
                    <td className="border border-gray-500 px-4 py-2">{expert.contact}</td>
                    
                    <td className="border border-gray-500 px-4 py-2">
                    <span
    className={`px-2 py-1 rounded text-sm ${
      expert.status === 'pending'
        ? 'bg-yellow-500'
        : expert.status === 'approved'
        ? 'bg-green-500'
        : 'bg-red-500'
    }`}
  >
    {expert.status === 'approved'
      ? `${expert.subscription || 'No subscription'})`
      : expert.status}
  </span>
                    </td>
                    <td className="border border-gray-500 px-4 py-2 space-x-2">
                      {expert.status === 'pending' && (
                        <>
                          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                            Approve
                          </button>
                          <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                            Reject
                          </button>
                        </>
                      )}
                      {expert.status === 'approved' && (
                        <span className="text-green-400">Approved</span>
                      )}
                      {expert.status === 'rejected' && (
                        <span className="text-red-400">Rejected</span>
                      )}
                      <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded'>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
          currentPage={currentPage}
          totalPages={totalPage/8}
            // totalPages={itemsPerPage}
            
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}

export default ExpertManagement;