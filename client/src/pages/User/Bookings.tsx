import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, CalendarDays, Clock, Loader2, Star } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { getUserBookings } from "@/services/User/expert.service";
import { cancelBooking } from "@/services/User/booking.service";
import { ConfirmationModal } from "@/components/ConfirmModal";

import AddReviewModal from "@/components/User/modals/AddReviewModal";
import { Pagination, Stack } from "@mui/material";
import { IBooking } from "@/Interfaces/interfaces";


export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
const [bookingToReview, setBookingToReview] = useState<IBooking | null>(null);
  const limit = 8;

  const fetchBookings = async (page: number) => {
    try {
      setLoading(true);
      const response = await getUserBookings(page + 1, limit);
      if (response.success) {
        setBookings(response.bookings || []);
        setTotalPages(response.totalPages || 1);
        setTotalBookings(response.totalCount || 0);
      } else {
        toast.error(response.message || "Failed to fetch bookings");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCancelConfirmation = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setIsModalOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    try {
      setCancelling(true);
      const response = await cancelBooking(bookingToCancel);
      
      if (response.success) {
        toast.success(response.message);
        // Update the booking status in state
        setBookings(prevBookings => 
          prevBookings.filter(booking => 
            booking._id !== bookingToCancel   
          )
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setCancelling(false);
      setIsModalOpen(false);
      setBookingToCancel(null);
    }
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
  const openReviewModal = (booking: IBooking) => {
    setBookingToReview(booking);
    setIsReviewModalOpen(true);
  };
  
  const handleReviewSuccess = () => {
    // Optional: refetch bookings or update booking locally to hide review button
    fetchBookings(currentPage);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">
            {totalBookings} {totalBookings === 1 ? "booking" : "bookings"} total
          </p>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0"
          onClick={() => fetchBookings(currentPage)}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CalendarDays className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't made any bookings yet.
          </p>
          <Button className="mt-4">
            Book a Service
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bookings.map((booking) => (
              <Card 
                key={booking._id} 
                className="h-full flex flex-col"
              >
                <div className="p-4 flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={booking?.expertId?.userId?.profile_image} />
                      <AvatarFallback className="bg-gray-100">
                        {booking?.expertId?.userId?.name?.charAt(0) || "E"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {booking?.expertId?.userId?.name || "Expert"}
                      </h3>
                      <div className="text-sm text-gray-500">
                        {booking?.expertId?.serviceId?.name || "Service"}
                      </div>
                    </div>
                    {booking.status === "completed" && !booking.review && (
  <Button 
    size="sm" 
    variant="outline" 
    onClick={() => openReviewModal(booking)} 
    className="mt-2"
  >
    Add Review
  </Button>
)}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => openCancelConfirmation(booking._id)}
                        
                      >
                        Cancel
                      </Button>
                    )}

                  </div>
                  

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <CalendarDays className="w-4 h-4 text-gray-500" />
                      <span>
                        {format(new Date(booking.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="line-clamp-2">
                        {booking?.location?.address || "Location not specified"}
                      </span>
                    </div>
                    
                  </div>
                </div>
                <Separator />
                <div className="p-3">
                  {booking.images?.length > 0 && (
                    <div className="flex overflow-x-auto gap-2 pb-2">
                      {booking.images.map((img: string, index: number) => (
                        <img 
                          key={index} 
                          src={img} 
                          alt="Booking reference" 
                          className="h-16 w-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                  {booking.status=='cancelled'&&
                  <p className="text-sm text-red-500 line-clamp-2">
                  <span className="font-medium">Reason:</span> {booking.cancellationReason}
                </p>
                  }
                  {booking.notes && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      <span className="font-medium">Notes:</span> {booking.notes}
                    </p>
                  )}
                </div>
                
              </Card>
            ))}
          </div>
          {isReviewModalOpen && bookingToReview && (
  <AddReviewModal
    expertId={bookingToReview.expertId._id}
    onClose={() => setIsReviewModalOpen(false)}
    onSuccess={handleReviewSuccess}
  />
)}

          {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                },
                '& .Mui-selected': {
                  fontWeight: 'bold',
                },
              }}
            />
          </Stack>
        </div>
          )}

          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleCancelBooking}
            title="Confirm Cancellation"
            description="Are you sure you want to cancel this booking? This action cannot be undone."
            confirmText={cancelling ? "Cancelling..." : "Confirm Cancellation"}
          />
        </>
      )}
    </div>
  );
}