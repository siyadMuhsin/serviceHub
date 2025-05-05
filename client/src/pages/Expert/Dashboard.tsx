import { FileText, CheckCircle, Clock, Users, XCircle } from "lucide-react";
import { differenceInDays } from 'date-fns';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { get_expert, get_expert_bookings, getBookingsToExpert } from "@/services/Expert/expert.service";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loading from "@/components/Loading";
import { IExpert } from "@/Interfaces/interfaces";

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [expert, setExpert] = useState<IExpert>();
  const [stats, setStats] = useState({
    totalRequests: 0,
    completedJobs: 0,
    pendingRequests: 0,
    cancelledRequests: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch expert data
        const expertResponse = await get_expert();
        if (expertResponse.success) {
          setExpert(expertResponse.expert);
        }

        // Fetch expert bookings
        const bookingsResponse = await get_expert_bookings();
        const recentBookings = await getBookingsToExpert("", 1, 3);
        setRecentRequests(recentBookings.bookings);

        setStats({
          totalRequests: bookingsResponse.total,
          completedJobs: bookingsResponse.completed,
          pendingRequests: bookingsResponse.pending,
          cancelledRequests: bookingsResponse.cancelled
        });
      } catch (error) {
        toast.error(error.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !expert) {
    return <Loading />;
  }

  let daysRemaining: number | null = null;
  if (expert.subscription.plan && expert.subscription.plan.isActive) {
    const endDate = new Date(expert.subscription.endDate);
    daysRemaining = differenceInDays(endDate, new Date());
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex-1">
        <main className="w-full">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {/* Header with welcome message and buttons */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg bg-gray-50 p-4 shadow-sm">
              <h2 className="text-lg sm:text-xl font-medium text-gray-700">Welcome, {expert?.accountName} 👋</h2>
              <div className="w-full sm:w-auto">
                {!expert.subscription.isActive ? (
                  <div className="p-3 sm:p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-sm sm:text-base font-semibold">Your subscription is inactive.</p>
                    </div>
                    <Link
                      to="/expert/subscription"
                      state={{ expert }}
                      className="bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      Purchase Subscription
                    </Link>
                  </div>
                ) : (
                  <div className="p-3 sm:p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md">
                    <span className="text-xs sm:text-sm font-medium">
                      Subscription Active:{" "}
                      <span className="font-bold">{daysRemaining} days remaining</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats cards */}
            <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <Card className="border border-blue-100">
                <CardContent className="flex items-center p-4 sm:p-6">
                  <div className="mr-3 sm:mr-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-blue-50">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalRequests}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Total Requests</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-green-100">
                <CardContent className="flex items-center p-4 sm:p-6">
                  <div className="mr-3 sm:mr-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.completedJobs}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Completed Jobs</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-yellow-100">
                <CardContent className="flex items-center p-4 sm:p-6">
                  <div className="mr-3 sm:mr-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-yellow-50">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.pendingRequests}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Pending Requests</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-red-100">
                <CardContent className="flex items-center p-4 sm:p-6">
                  <div className="mr-3 sm:mr-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-red-50">
                    <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.cancelledRequests}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Cancelled Requests</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Service Requests */}
            <div className="mb-6 sm:mb-8">
              <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-gray-800">Recent Service Requests</h3>
              <Card>
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Client Name</TableHead>
                        <TableHead className="whitespace-nowrap">Date</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentRequests.length > 0 ? (
                        recentRequests.map((request) => (
                          <TableRow key={request._id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {request.userId?.profile_image && (
                                  <img 
                                    src={request.userId.profile_image} 
                                    alt={request.userId.name}
                                    className="w-8 h-8 rounded-full mr-2 sm:mr-3"
                                  />
                                )}
                                <div>
                                  <p className="text-sm sm:text-base">{request.userId?.name || 'Unknown Client'}</p>
                                  <p className="text-xs text-gray-500">{request.userId?.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm sm:text-base">{new Date(request.date).toLocaleDateString()}</span>
                                <span className="text-xs text-gray-500">{request.time}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  request.status === "completed"
                                    ? "success"
                                    : request.status === "pending"
                                      ? "warning"
                                      : "destructive"
                                }
                                className="text-xs sm:text-sm"
                              >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                            No recent requests found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
 
    </div>
  );
}