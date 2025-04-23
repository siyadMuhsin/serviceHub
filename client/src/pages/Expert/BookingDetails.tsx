import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, CalendarDays, Clock, Mail, Info, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { updateBookingStatus } from "@/services/Expert/expert.service";
import { ConfirmationModal } from "@/components/ConfirmModal";
import { Badge } from "@/components/ui/badge";
import { CancelReasonModal } from "@/components/CancelResonModal";

interface BookingDetailsViewProps {
  booking: any;
  onBack: () => void;
}

export default function BookingDetailsView({
  booking,
  onBack,
}: BookingDetailsViewProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(booking.status);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const openConfirmation = (newStatus: string) => {
    setPendingStatus(newStatus);
    setIsModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!pendingStatus || pendingStatus === status) {
      setIsModalOpen(false);
      return;
    }
  
    try {
      setLoading(true);
      const response = await updateBookingStatus(booking._id, pendingStatus);
      if (response.success) {
        toast.success("Booking status updated successfully");
        setStatus(pendingStatus);
        onBack();
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const getConfirmText = (status: string | null) => {
    switch (status) {
      case "confirmed":
        return "Are you sure you want to confirm this booking?";
      case "cancelled":
        return "Are you sure you want to cancel this booking?";
      case "completed":
        return "Mark this booking as completed?";
      default:
        return "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 px-3 py-1 text-sm font-medium">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 px-3 py-1 text-sm font-medium">Cancelled</Badge>;
      default:
        return <Badge className="px-3 py-1 text-sm font-medium">{status}</Badge>;
    }
  };

  const handleCancelWithReason = async (reason: string) => {
    if (!pendingStatus || pendingStatus === status) {
      setShowCancelModal(false);
      return;
    }
  
    try {
      setLoading(true);
      const response = await updateBookingStatus(booking._id, pendingStatus, reason);
      if (response.success) {
        toast.success("Booking status updated successfully");
        setStatus(pendingStatus);
        onBack();
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setShowCancelModal(false);
    }
  };
  console.log(selectedImage)
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 hover:bg-gray-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Bookings
            </Button>
            <div>
              {getStatusBadge(status)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Customer Info */}
          <div className="lg:col-span-1 ">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#1a4a33] to-[#0d2e20] p-6 text-white">
                <h2 className="text-xl font-bold">Customer Details</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                    <AvatarImage src={booking?.userId?.profile_image} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">
                      {booking?.userId?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-bold">{booking?.userId?.name}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Email</p>
                      <p className="text-sm font-medium">{booking?.userId?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{booking?.userId?.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Distance</p>
                      <p className="text-sm font-medium">{booking?.distance} km away</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Booking Details */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#1a4a33] to-[#0d2e20] p-6 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CalendarDays className="w-6 h-6" />
                  Booking Details
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <CalendarDays className="w-5 h-5" />
                      <span className="font-medium">Appointment Date</span>
                    </div>
                    <p className="text-lg font-semibold pl-7">
                      {new Date(booking?.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Appointment Time</span>
                    </div>
                    <p className="text-lg font-semibold pl-7">{booking?.time}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Location</span>
                  </div>
                  <p className="text-lg font-semibold pl-7 mb-4">{booking?.location?.address}</p>
                  <div className="rounded-lg overflow-hidden shadow-sm">
                    <iframe
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${booking?.location?.coordinates[1]},${booking?.location?.coordinates[0]}&z=15&output=embed`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                {booking?.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Info className="w-5 h-5" />
                      <span className="font-medium">Customer Notes</span>
                    </div>
                    <div className="pl-7 text-gray-700">
                      <p>{booking.notes}</p>
                    </div>
                  </div>
                )}

                {booking?.images?.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <ImageIcon className="w-5 h-5" />
                      <span className="font-medium">Attached Images</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pl-7">
                      {booking.images.map((img: string, idx: number) => (
                        <div key={idx} className="relative group">
                          <div 
                            className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer transition-all hover:shadow-md"
                            onClick={() => setSelectedImage(img)}
                          >
                            <img 
                              src={img} 
                              alt={`booking reference ${idx + 1}`} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              {status === "pending" && (
                <>
                  
                  <Button
  disabled={loading}
  variant="outline"
   className="border-red-300 text-red-700 hover:bg-red-50"
  onClick={() => {

    setPendingStatus("cancelled");
  setShowCancelModal(true);
  }}
>
  Cancel
</Button>
                  <Button 
                    disabled={loading} 
                    onClick={() => openConfirmation("confirmed")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Confirm Booking
                  </Button>
                </>
              )}

              {status === "confirmed" && (
                <Button 
                  disabled={loading} 
                  onClick={() => openConfirmation("completed")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Mark as Completed
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <Button 
              variant="ghost" 
              className="absolute top-0 right-0 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 m-2"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <img 
              src={selectedImage} 
              alt="enlarged view" 
              className="max-w-full max-h-screen object-contain rounded-lg"
            />
          </div>
          <div 
            className="absolute inset-0 z-40" 
            onClick={() => setSelectedImage(null)}
          ></div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={getConfirmText(pendingStatus)}
        description="This action cannot be undone."
        onConfirm={handleStatusChange}
      />
      <CancelReasonModal
  isOpen={showCancelModal}
  onClose={() => setShowCancelModal(false)}
  loading={loading}
  onSubmit={handleCancelWithReason}
  />
    </div>
  );
}

function ImageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}