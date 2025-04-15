import { useState, useEffect } from "react";
import { IExpert } from "@/Interfaces/interfaces";
import { Calendar, Image as ImageIcon, MapPin, Edit3, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  getAvailableSlots,
  handlingBooking,
} from "@/services/User/expert.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";

interface LocationData {
  coordinates: { lat: number; lng: number };
  address: string;
}

interface TimeSlot {
  _id: string;
  date: string;
  timeSlots: string[];
}

export default function BookingModal({
  expert,
  isOpen,
  onClose,
}: {
  expert: IExpert;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotId, setSlotId] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const [manualLocation, setManualLocation] = useState("");
  const [location, setLocation] = useState<{
    address: string;
    coordinates?: { lat: number; lng: number };
  } | null>(null);
  const { userLocation } = useSelector((state: any) => state.location);
  // Fetch available slots when modal opens
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await getAvailableSlots(expert._id);
        setSlots(res.slots);
        if (res.slots.length > 0) {
          setSelectedDate(res.slots[0].date);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch available slots");
      }
    };

    if (isOpen) {
      fetchSlots();
      // Reset form when opening
      setSelectedSlot("");
      setNotes("");
      setImages([]);
      setImagePreviews([]);
      setManualLocation("");
      setLocation({
        address: userLocation.address,
        coordinates: { lat: userLocation.lat, lng: userLocation.lng },
      });
      setIsEditingLocation(false);
    }
  }, [expert._id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newImages = [...images, ...files];

      if (newImages.length > 5) {
        toast.warning("Maximum 5 images allowed");
        setImages(newImages.slice(0, 5));
        setImagePreviews(
          newImages.slice(0, 5).map((file) => URL.createObjectURL(file))
        );
      } else {
        setImages(newImages);
        setImagePreviews([
          ...imagePreviews,
          ...files.map((file) => URL.createObjectURL(file)),
        ]);
      }
    }
  };
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };
  const API_KEY = "173c9408b3a6422b810bccbc0d6f9d5c";

  const fetchLocationCoordinates = async () => {
    if (!manualLocation.trim()) {
      toast.error("Please enter a location");
      return;
    }

    try {
      setLocationLoading(true);
      // Replace with your actual geocoding API call
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          manualLocation
        )}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const result = data.results[0];
        setLocation({
          address: result.formatted,
          coordinates: {
            lat: result.geometry.lat,
            lng: result.geometry.lng,
          },
        });
        setIsEditingLocation(false);
        toast.success("Location fetched successfully");
      } else {
        toast.error("Location not found. Try again.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Failed to fetch location coordinates");
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
          );
          const data = await response.json();

          if (data.results.length > 0) {
            const result = data.results[0];
            setLocation({
              address: result.formatted,
              coordinates: {
                lat: latitude,
                lng: longitude,
              },
            });
            toast.success("Current location fetched");
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          toast.error("Failed to fetch location address");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Failed to get current location");
        setLocationLoading(false);
      }
    );
  };

  const currentDateSlots =
    slots.find((slot) => slot._id === slotId)?.timeSlots || [];

  const handleSubmit = async () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    if (!location) {
      toast.error("Please select a location");
      return;
    }

    try {
      setLoading(true);

      const coordinates = [location.coordinates.lng, location.coordinates.lat];
      const formData = new FormData();
      formData.append("expertId", expert._id);
      formData.append("time", selectedSlot.split("|")[1]);
      formData.append("date", selectedDate);
      formData.append("notes", notes);
      formData.append("slotId", slotId);
      formData.append("location", JSON.stringify(coordinates));
      formData.append("address", location.address);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await handlingBooking(formData);
      console.log(response);

      toast.success("Booking created successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Book a Session with {expert.userId.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-w-96 pb-4">
          {/* Date Selector */}
          <div className="space-y-2">
            <Label className="font-medium">Select Date</Label>
            <Select
              value={slotId}
              onValueChange={(val) => {
                setSlotId(val);
                const selectedSlot = slots.find((slot) => slot._id === val);
                if (selectedSlot) {
                  setSelectedDate(selectedSlot.date);
                }
              }}
              disabled={slots.length === 0}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <SelectValue
                    placeholder={
                      slots.length === 0
                        ? "No dates available"
                        : "Select a date"
                    }
                  >
                    {selectedDate ? formatDate(selectedDate) : ""}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-60">
                  <SelectGroup>
                    {slots.length > 0 ? (
                      slots.map((slot) => (
                        <SelectItem key={slot._id} value={slot._id}>
                          {formatDate(slot.date)}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectLabel>No available dates</SelectLabel>
                    )}
                  </SelectGroup>
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Time Slots */}
          {currentDateSlots.length > 0 ? (
            <div className="space-y-2">
              <Label className="font-medium">Available Time Slots</Label>
              <RadioGroup
                value={selectedSlot}
                onValueChange={setSelectedSlot}
                className="grid grid-cols-3 gap-2"
              >
                {currentDateSlots.map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={`${selectedDate}|${time}`}
                      id={`time-${time}`}
                      className="peer hidden"
                    />
                    <Label
                      htmlFor={`time-${time}`}
                      className="w-full border rounded-md p-2 text-center hover:bg-accent cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white"
                    >
                      {time}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="text-destructive text-center py-4">
              No available slots for this date
            </div>
          )}

          {/* Location Selection */}
          <div className="space-y-3 pt-2">
            <Label className="font-medium">Session Location</Label>

            {isEditingLocation ? (
              <div className="flex items-center gap-2">
                <Input
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  placeholder="Enter address or location details"
                  disabled={locationLoading}
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchLocationCoordinates}
                  disabled={locationLoading || !manualLocation.trim()}
                >
                  {locationLoading ? "..." : "Fetch"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingLocation(false)}
                  disabled={locationLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between border p-2 rounded">
                <div className="flex items-center overflow-hidden">
                  <MapPin className="text-blue-500 flex-shrink-0 mr-2 h-4 w-4" />
                  <span className="text-sm truncate">
                    {location?.address || "No location set"}
                  </span>
                </div>
                <div className="flex flex-shrink-0 gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsEditingLocation(true)}
                    disabled={locationLoading}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={fetchCurrentLocation}
                    disabled={locationLoading}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {location?.coordinates && (
              <div className="text-xs text-muted-foreground">
                Coordinates: {location.coordinates.lat.toFixed(6)},{" "}
                {location.coordinates.lng.toFixed(6)}
              </div>
            )}
          </div>

          {/* Images Upload */}
          <div className="space-y-2">
            <Label className="font-medium">Upload Images (Optional)</Label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent transition-colors">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm">Add Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-muted-foreground">
                Max 5 images (2MB each)
              </span>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="font-medium">Additional Notes</Label>
            <Textarea
              placeholder="Any special requirements or details about your session?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedSlot || !location}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
