// pages/ExpertManagement.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";

import {
  block_unlbock_expert,
  expert_change_action,
  get_experts,
} from "../../services/Admin/expert.service";
import Loading from "../../components/Loading";
import debounce from "../../Utils/debouce";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUser } from "@/Slice/authSlice";
import { ConfirmationModal } from "@/components/ConfirmModal";
import { Pagination, Stack } from "@mui/material";

interface Expert {
  _id?: string;
  accountName: string;
  categoryId: { name: string };
  serviceId?: { name: string };
  userId: { name: string; email: string };
  experience?: string;
  subscription: any;
  contact: string;
  isBlocked: boolean;
  status?: string;
}

function ExpertManagement() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Start with collapsed sidebar on mobile
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuary, setSearchQuery] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [reasonModal, setReasonModal] = useState(false);
  const [currentExpert, setCurrentExpert] = useState<Expert | null>(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    action: '',
    variant: "default",
  });
  const dispatch = useDispatch();
  const itemsPerPage = 8;

  // Fetch experts
  useEffect(() => {
    setLoading(true);
    const fetchExperts = async () => {
      try {
        const response = await get_experts(currentPage, itemsPerPage, filter, searchQuary);
        if (response.success) {
          setExperts(response.experts || []);
          setTotalPage(response.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching experts:", error);
        toast.error(error.message || "Failed to fetch experts");
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [currentPage, filter, searchQuary]);

  const handleFilterChange = (status: string) => {
    setFilter(status);
    setCurrentPage(0);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showConfirmation = (expert: Expert, action: string) => {
    setCurrentExpert(expert);
    let title = '';
    let description = '';
    let variant: 'default' | 'destructive' = 'default';

    switch (action) {
      case 'approve':
        title = 'Approve Expert';
        description = `Are you sure you want to approve ${expert.accountName}?`;
        variant = 'default';
        break;
      case 'reject':
        title = 'Reject Expert';
        description = `Are you sure you want to reject ${expert.accountName}?`;
        variant = 'destructive';
        break;
      case 'block':
        title = 'Block Expert';
        description = `Are you sure you want to block ${expert.accountName}?`;
        variant = 'destructive';
        break;
      case 'unblock':
        title = 'Unblock Expert';
        description = `Are you sure you want to unblock ${expert.accountName}?`;
        variant = "default";
        break;
    }

    setConfirmationModal({
      isOpen: true,
      title,
      description,
      action,
      variant,
    });
  };

  const handleConfirmAction = async () => {
    if (!currentExpert) return;

    setLoading(true);
    try {
      let response;
      
      if (confirmationModal.action === 'approve') {
        response = await expert_change_action(currentExpert._id!, 'approved');
      } else if (confirmationModal.action === 'reject') {
        setReasonModal(true);
        setConfirmationModal({ ...confirmationModal, isOpen: false });
        return;
      } else if (confirmationModal.action === 'block' || confirmationModal.action === 'unblock') {
        const isBlock = confirmationModal.action === 'block';
        response = await block_unlbock_expert(currentExpert._id!, isBlock);
      }

      if (response?.success) {
        setExperts(prev =>
          prev.map(expert =>
            expert._id === currentExpert._id
              ? {
                  ...expert,
                  status: confirmationModal.action === 'approve' ? 'approved' : 
                         confirmationModal.action === 'reject' ? 'rejected' : expert.status,
                  isBlocked: confirmationModal.action === 'block' ? true : 
                             confirmationModal.action === 'unblock' ? false : expert.isBlocked
                }
              : expert
          )
        );
        toast.success(`Expert ${confirmationModal.action} successfully`);
      } else {
        toast.error(response?.message || "Failed to perform action");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
      setConfirmationModal({ ...confirmationModal, isOpen: false });
    }
  };

  const handleRejectWithReason = async () => {
    if (!currentExpert || !rejectionReason) return;

    setLoading(true);
    try {
      const response = await expert_change_action(currentExpert._id!, 'rejected', rejectionReason);
      if (response?.success) {
        setExperts(prev =>
          prev.map(expert =>
            expert._id === currentExpert._id ? { ...expert, status: 'rejected' } : expert
          )
        );
        toast.success('Expert rejected successfully');
      } else {
        toast.error(response?.message || "Failed to reject expert");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
      setReasonModal(false);
      setRejectionReason('');
    }
  };

  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value);
    setCurrentPage(0);
  }, 400);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#171730] text-white transition-all pt-14 ">
        <Sidebar onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)} />
        <div className={`p-4 md:p-6 transition-all ${isSidebarExpanded ? "ml-0 md:ml-64" : "ml-16 md:ml-20"}`}>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Expert Management</h2>

          {/* Filter Options */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
                    filter === status ? "bg-blue-500" : "bg-gray-700"
                  } hover:bg-blue-600 transition`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="w-full md:w-auto">
              <input
                type="text"
                defaultValue={searchQuary}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search Experts"
                className="w-full p-2 rounded bg-[#2A2A3C] text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto ">
            <div className="min-w-full">
              {/* Mobile View - Cards */}
              <div className="md:hidden space-y-4">
                {experts.map((expert) => (
                  <div key={expert._id} className="bg-[#2C2C3E] p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{expert.accountName}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          expert.status === "pending"
                            ? "bg-yellow-500"
                            : expert.status === "approved"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {expert.status === "approved"
                          ? `${expert.subscription.isActive ? "subscribed" : 'No subscription'}`
                          : expert.status}
                        {expert.isBlocked && " (Blocked)"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">{expert.userId.email}</p>
                    <p className="text-sm text-gray-300 mb-3">{expert.contact}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {expert.status === "pending" && (
                        <>
                          <button
                            onClick={() => showConfirmation(expert, 'approve')}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => showConfirmation(expert, 'reject')}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {expert.status === "approved" && (
                        <div className="flex gap-2">
                          {expert.isBlocked ? (
                            <button
                              onClick={() => showConfirmation(expert, 'unblock')}
                              className="px-2 py-1 border border-green-500 text-white rounded hover:bg-green-600 text-sm"
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => showConfirmation(expert, 'block')}
                              className="px-2 py-1 border border-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                              Block
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Link
                      to={`/admin/expert/${expert._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm inline-block"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table */}
              <table className="hidden md:table w-full border-collapse border border-gray-600">
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
                            ? `${expert.subscription.isActive ? "subscribed" : 'No subscription'}`
                            : expert.status}
                          {expert.isBlocked && " (Blocked)"}
                        </span>
                      </td>
                      <td className="border border-gray-500 px-4 py-2 space-x-2">
                        {expert.status === "pending" && (
                          <>
                            <button
                              onClick={() => showConfirmation(expert, 'approve')}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => showConfirmation(expert, 'reject')}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {expert.status === "approved" && (
                          <div>
                            {expert.isBlocked ? (
                              <button
                                onClick={() => showConfirmation(expert, 'unblock')}
                                className="px-2 py-1 border border-green-500 text-white rounded hover:bg-green-600"
                              >
                                Unblock
                              </button>
                            ) : (
                              <button
                                onClick={() => showConfirmation(expert, 'block')}
                                className="px-2 py-1 border border-red-500 text-white rounded hover:bg-red-600"
                              >
                                Block
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-500 px-4 py-2">
                        <Link
                          to={`/admin/expert/${expert._id}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded block text-center"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {experts.length > 0 && (
            <div className="mt-8 md:mt-16 flex justify-center">
              <Stack spacing={2}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '0.875rem',
                      color: 'white',
                    },
                    '& .Mui-selected': {
                      fontWeight: 'bold',
                    },
                    '& .MuiPaginationItem-page:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                />
              </Stack>
            </div>
          )}
          {loading && <Loading />}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        description={confirmationModal.description}
        confirmText={confirmationModal.action.charAt(0).toUpperCase() + confirmationModal.action.slice(1)}
        variant={confirmationModal.variant}
      />

      {/* Rejection Reason Modal */}
      {reasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-black">Reason for Rejection</h3>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4 text-black"
              placeholder="Enter reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setReasonModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectWithReason}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                disabled={!rejectionReason}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExpertManagement;