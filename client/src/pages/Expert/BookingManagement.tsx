import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { getBookingsToExpert } from "@/services/Expert/expert.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, CalendarDays, Clock, Loader2 } from "lucide-react";
import BookingDetailsView from "./BookingDetails";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ManageBookings() {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getBookingsToExpert(selectedStatus, 1, 10);
      if (response.success) {
        setBookings(response.bookings || []);
      } else {
        toast.error(response.message || "Failed to fetch bookings");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus]);

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm">Pending</Badge>;
      case "confirmed":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs sm:text-sm">Confirmed</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs sm:text-sm">Completed</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs sm:text-sm">Cancelled</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs sm:text-sm">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {selectedBooking ? (
        <BookingDetailsView
          booking={selectedBooking}
          onBack={() => setSelectedBooking(null)}
        />
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Bookings</h1>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={fetchBookings} 
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
              </Button>
            </div>
          </div>

          <Tabs 
            defaultValue="pending" 
            value={selectedStatus} 
            onValueChange={setSelectedStatus}
            className="space-y-4 sm:space-y-6"
          >
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full bg-gray-100 p-1 h-auto gap-1">
              <TabsTrigger 
                value="pending" 
                className="py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                  Pending
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="confirmed" 
                className="py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Confirmed
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Completed
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Cancelled
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedStatus} className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="flex justify-center items-center h-48 sm:h-64">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-500" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 sm:py-16 bg-gray-50 rounded-lg border border-dashed">
                  <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <CalendarDays className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">No bookings found</h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    There are currently no {selectedStatus} bookings.
                  </p>
                  <Button variant="outline" className="mt-3 sm:mt-4 text-xs sm:text-sm" onClick={fetchBookings}>
                    Refresh
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {bookings.map((booking) => (
                    <Card 
                      key={booking._id} 
                      className="overflow-hidden transition-all hover:shadow-md sm:hover:shadow-lg hover:-translate-y-0.5 sm:hover:-translate-y-1"
                    >
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white shadow">
                              <AvatarImage src={booking?.userId?.profile_image} />
                              <AvatarFallback className="bg-gray-100">
                                {booking?.userId?.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                {booking?.userId?.name}
                              </h3>
                              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                <Phone className="w-3 h-3" />
                                <span className="truncate">{booking?.userId?.phone}</span>
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>

                        <Separator className="my-3 sm:my-4" />

                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-1 sm:p-1.5 bg-blue-50 rounded-lg">
                              <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Date & Time</p>
                              <p className="text-xs sm:text-sm font-medium">
                                {format(new Date(booking.date), 'MMM dd, yyyy')} • {booking.time}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-1 sm:p-1.5 bg-purple-50 rounded-lg">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Location</p>
                              <p className="text-xs sm:text-sm font-medium line-clamp-2">
                                {booking?.location?.address || "No address provided"}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                                {booking.distance} km away
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          className="w-full mt-3 sm:mt-4 text-xs sm:text-sm"
                          onClick={() => handleViewDetails(booking)}
                        >
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}