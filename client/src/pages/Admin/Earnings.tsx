import Header from "@/components/Admin/Header";
import Sidebar from "@/components/Admin/Sidebar";
import { getAllEarnings } from "@/services/Admin/subscription.service";
import React, { useEffect, useState } from "react";
import { FiDollarSign } from "react-icons/fi";
import { toast } from "react-toastify";
import { MdCurrencyRupee } from "react-icons/md";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Plan {
  _id: string;
  name: string;
}

function Earnings() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await getAllEarnings(
        selectedPlan === "all" ? "" : selectedPlan,
        page,
        limit
      );
      console.log(response);
      if (response.success) {
        setEarnings(response.data.earnings);
        setTotalEarnings(response.data.totalEarnings);
        setPagination(response.data.pagination);
        setPlans(response.data.plans || []);
      } else {
        toast.error(response.message || "Failed to fetch earnings");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [selectedPlan, page]);

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlan(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setPage(newPage);
    }
  };
  if (!earnings) {
    return (
      <>
        <h1>onnullage</h1>
      </>
    );
  }
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#171730] text-white transition-all pt-14">
        <Sidebar onToggle={setIsSidebarExpanded} />
        <main
          className={`transition-all duration-300 ${
            isSidebarExpanded ? "pl-72" : "pl-20"
          } pr-4 py-6`}
        >
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                Expert Subscription Earnings
              </h1>
              <div className="bg-[#27293D] px-6 py-3 rounded-lg flex items-center">
                <MdCurrencyRupee className="mr-3 text-green-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                  <p className="text-2xl font-bold">
                    {totalEarnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Plan Filter */}
            <div className="mb-6">
              <label
                htmlFor="plan-filter"
                className="block text-sm text-gray-400 mb-2"
              >
                Filter by Plan:
              </label>
              <select
                id="plan-filter"
                value={selectedPlan}
                onChange={handlePlanChange}
                className="bg-[#1E1E2F] border border-gray-700 rounded-lg px-4 py-2"
                disabled={loading}
              >
                <option value="all">All Plans</option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan.name}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Loading or Table */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="bg-[#27293D] rounded-xl overflow-hidden shadow-lg mb-6">
                  <table className="min-w-full">
                    <thead className="bg-[#1E1E2F]">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm text-gray-400 uppercase">
                          Expert
                        </th>
                        <th className="px-6 py-4 text-left text-sm text-gray-400 uppercase">
                          Plan
                        </th>
                        <th className="px-6 py-4 text-left text-sm text-gray-400 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm text-gray-400 uppercase">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {earnings.map((payment) => (
                        <tr key={payment._id} className="hover:bg-[#1E1E2F]">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-800">
                                {payment.expertId?.userId?.profile_image ? (
                                  <img
                                    src={payment.expertId.userId.profile_image}
                                    alt="Expert Profile"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-white font-bold bg-blue-500">
                                    {payment.expertId?.userId?.name?.charAt(
                                      0
                                    ) || "N"}
                                  </div>
                                )}
                              </div>
                              <div className="font-medium">
                                {payment.expertId?.userId?.name ||
                                  "Unknown Expert"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full text-sm bg-gray-500/20 text-gray-400">
                              {payment.planId.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            ₹{payment.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination && (
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Showing {earnings.length} of {pagination.total} entries
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-1 rounded bg-[#27293D] text-gray-400 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 rounded bg-blue-600 text-white">
                        {page}
                      </span>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= pagination.totalPages}
                        className="px-3 py-1 rounded bg-[#27293D] text-gray-400 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Earnings;
