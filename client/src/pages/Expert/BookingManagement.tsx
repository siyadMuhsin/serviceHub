import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { getBookingsToExpert, updateBookingStatus } from "@/services/Expert/expert.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MapPin, CalendarDays, Clock, MessageSquare, Phone } from "lucide-react";
// import { HoverCard,HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";


export default function ManageBookings() {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null); // Track selected booking for details

  const fetchBookings = async (status?: string) => {
    try {
      setLoading(true);
      const response = await getBookingsToExpert(status || selectedStatus, 1, 10);
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

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingStatus(bookingId);
      const response = await updateBookingStatus(bookingId, newStatus);
      if (response.success) {
        toast.success(`Booking ${newStatus} successfully`);
        fetchBookings(selectedStatus);
        if (selectedBooking?._id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus }); // Update selected booking status
        }
      } else {
        toast.error(response.message || `Failed to update booking status`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to update booking status`);
    } finally {
      setUpdatingStatus(null);
    }
  };
console.log(selectedBooking)
  const filteredBookings = bookings.filter(
    (booking) => booking.status === selectedStatus
  );

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusActions = (booking: any) => {
    switch (booking.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => handleStatusUpdate(booking._id, "confirmed")}
              disabled={updatingStatus === booking._id}
            >
              {updatingStatus === booking._id ? "Processing..." : "Confirm"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusUpdate(booking._id, "cancelled")}
              disabled={updatingStatus === booking._id}
            >
              Cancel
            </Button>
          </div>
        );
      case "confirmed":
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => handleStatusUpdate(booking._id, "completed")}
              disabled={updatingStatus === booking._id}
            >
              {updatingStatus === booking._id ? "Processing..." : "Complete"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusUpdate(booking._id, "cancelled")}
              disabled={updatingStatus === booking._id}
            >
              Cancel
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  // Back to list view
  const handleBack = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <Button variant="outline" onClick={() => fetchBookings()}>
          Refresh
        </Button>
      </div>

      {selectedBooking ? (
        // Detailed View
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Booking Details</h2>
            <Button variant="outline" onClick={handleBack}>
              Back to List
            </Button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedBooking.userId?.profilePicture} />
                <AvatarFallback>
                  {selectedBooking.userId?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedBooking.userId?.name || "Unknown User"}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedBooking.userId?.email || "No email"}
                </p>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-auto" />

            {/* Booking Details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{formatDate(selectedBooking.date)}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedBooking.time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm">{selectedBooking.location?.address || "No address"}</p>
              </div>

              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm">{selectedBooking.notes || "No notes"}</p>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-auto" />

            {/* Status and Actions */}
            <div className="flex flex-col items-end gap-2">
              <p className="text-sm">Status: {selectedBooking.status}</p>
              {getStatusActions(selectedBooking)}
            </div>
          </div>
        </Card>
      ) : (
        // List View
        <Tabs defaultValue="pending" onValueChange={setSelectedStatus}>
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedStatus}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredBookings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredBookings.map((booking) => (
                  <Card key={booking._id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={booking.userId?.profilePicture} />
                          <AvatarFallback>
                            {booking.userId?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="font-medium">{booking.userId?.name || "Unknown User"}</h2>
                          <p className="text-xs text-muted-foreground">
                            {booking.userId?.email || "No email"}
                          </p>
                        </div>
                      </div>

                      {/* Booking Title and Details */}
                      <div className="flex-1">
                        <h3 className="font-medium">{booking.title || "No Title"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {truncateText(booking.notes || "No description", 50)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{booking.location?.address || "No location"}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>

                      {/* View Details Button */}
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <MapPin className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-xl font-medium">No {selectedStatus} bookings</h3>
                  <p className="text-muted-foreground">
                    You don't have any {selectedStatus} bookings right now.
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}