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
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "confirmed":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {selectedBooking ? (
        <BookingDetailsView
          booking={selectedBooking}
          onBack={() => setSelectedBooking(null)}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={fetchBookings} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
              </Button>
            </div>
          </div>

          <Tabs 
            defaultValue="pending" 
            value={selectedStatus} 
            onValueChange={setSelectedStatus}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1.5 h-auto">
              <TabsTrigger value="pending" className="py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                  Pending
                </span>
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Confirmed
                </span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Completed
                </span>
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Cancelled
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedStatus} className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarDays className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are currently no {selectedStatus} bookings.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={fetchBookings}>
                    Refresh
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.map((booking) => (
                    <Card 
                      key={booking._id} 
                      className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12 border-2 border-white shadow">
                              <AvatarImage src={booking?.userId?.profile_image} />
                              <AvatarFallback className="bg-gray-100">
                                {booking?.userId?.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {booking?.userId?.name}
                              </h3>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Phone className="w-3 h-3" />
                                <span>{booking?.userId?.phone}</span>
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                              <CalendarDays className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Date & Time</p>
                              <p className="text-sm font-medium">
                                {format(new Date(booking.date), 'MMM dd, yyyy')} • {booking.time}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-purple-50 rounded-lg">
                              <MapPin className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Location</p>
                              <p className="text-sm font-medium line-clamp-2">
                                {booking?.location?.address || "No address provided"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {booking.distance} km away
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
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