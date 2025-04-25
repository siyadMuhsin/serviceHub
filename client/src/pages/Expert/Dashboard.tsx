import { FileText, CheckCircle, Clock, Users, XCircle } from "lucide-react";
import { differenceInDays } from 'date-fns';
import { Footer } from "@/components/Expert/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { get_expert, get_expert_bookings, getBookingsToExpert } from "@/services/Expert/expert.service";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loading from "@/components/Loading";

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [expert, setExpert] = useState<any>();
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
        const recentBookings= await getBookingsToExpert("",1,3)
        console.log(recentBookings.bookings);
        
        setRecentRequests(recentBookings.bookings)
        cancelAnimationFrame

          const total = bookingsResponse.total;
          const completed = bookingsResponse.completed
          const pending = bookingsResponse.pending
          const cancelled = bookingsResponse.cancelled

          setStats({
            totalRequests: total,
            completedJobs: completed,
            pendingRequests: pending,
            cancelledRequests: cancelled
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
    <div className="flex flex-col w-[100%]">
      <div className="flex flex-1">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">
            {/* Header with welcome message and buttons */}
            <div className="mb-8 flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
              <h2 className="text-xl font-medium text-gray-700">Welcome, {expert?.accountName} 👋</h2>
              <div className="flex items-center gap-4">
                {!expert.subscription.isActive ? (
                  <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 animate-pulse rounded-md flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Your subscription is inactive.</p>
                    </div>
                    <Link
                      to="/expert/subscription"
                      state={{ expert }}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Purchase Subscription
                    </Link>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Subscription Active:{" "}
                      <span className="font-bold">{daysRemaining} days remaining</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats cards */}
            <div className="mb-8 grid gap-6 md:grid-cols-4">
              <Card className="border border-blue-100">
                <CardContent className="flex items-center p-6">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalRequests}</p>
                    <p className="text-sm text-gray-600">Total Requests</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-green-100">
                <CardContent className="flex items-center p-6">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.completedJobs}</p>
                    <p className="text-sm text-gray-600">Completed Jobs</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-yellow-100">
                <CardContent className="flex items-center p-6">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.pendingRequests}</p>
                    <p className="text-sm text-gray-600">Pending Requests</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-red-100">
                <CardContent className="flex items-center p-6">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.cancelledRequests}</p>
                    <p className="text-sm text-gray-600">Cancelled Requests</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Service Requests */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-gray-800">Recent Service Requests</h3>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
               
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
              className="w-8 h-8 rounded-full mr-3"
            />
          )}
          <div>
            <p>{request.userId?.name || 'Unknown Client'}</p>
            <p className="text-xs text-gray-500">{request.userId?.email}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-col">
          <span>{new Date(request.date).toLocaleDateString()}</span>
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
        >
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </Badge>
      </TableCell>
   
    </TableRow>
  ))
) : (
  <TableRow>
    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
      No recent requests found
    </TableCell>
  </TableRow>
)}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}