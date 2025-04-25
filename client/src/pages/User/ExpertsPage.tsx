import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, MapPin, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getExpertsSpecificService, getReviewsByExpertId } from "@/services/User/expert.service";
import { toast } from "react-toastify";
import { IExpert } from "@/Interfaces/interfaces";

const ExpertsPage = () => {
  const [experts, setExperts] = useState<IExpert[]>([]);
  const { id: serviceId } = useParams();
  const navigate = useNavigate(); // Fixed typo from 'navigete' to 'navigate'

  // Remove the first useEffect as it was setting the same empty array
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await getExpertsSpecificService(serviceId);
        if (response.success) {
          setExperts(response.experts);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchExperts();
  }, [serviceId]); // Added serviceId as dependency
  const handleViewProfile = (expertId: string) => {
    navigate(`/user/expert/${expertId}`); // Fixed typo and moved navigate inside the function
  };

  
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
          Find Trusted Home Service Experts
        </h1>

        {experts.length === 0 && (
  <div className="flex justify-center items-center h-60 bg-white border border-dashed border-gray-300 rounded-lg shadow-sm mb-8">
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Experts Found</h3>
      <p className="text-gray-500 text-sm">
        Try adjusting your search or check back later.
      </p>
    </div>
  </div>
)}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experts.map((expert) => (
            <ExpertCard 
              key={expert._id} // Changed from expert.id to expert._id assuming MongoDB-style IDs
              expert={expert} 
              onViewProfile={handleViewProfile} // Pass the handler as prop
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />;
        } else if (i === fullStars && hasHalfStar) {
          return <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />;
        } else {
          return <Star key={i} size={16} className="text-gray-300" />;
        }
      })}
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};
const ExpertCard = ({ 
  expert, 
  onViewProfile 
}: { 
  expert: any; 
  onViewProfile: (expertId: string) => void; 
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex justify-between items-start gap-4">
        {/* Left: Profile Image + Info */}
        <div className="flex gap-4">
          <img
            src={expert.profile}
            alt={expert.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="flex flex-col justify-between">
            {/* Name & Service */}
            <div>
              <h3 className="font-bold text-lg">{expert.name}</h3>
              <p className="text-sm text-gray-600">{expert.service} Specialist</p>
            </div>

            {/* Distance */}
            <div className="flex items-center mt-1 text-sm text-blue-600 font-medium">
              <MapPin className="w-4 h-4 mr-1 text-blue-500" />
              <span>{expert.distanceInKm.toFixed(2)} km away</span>
            </div>

            {/* Rating & Reviews */}
            <div className="mt-2">
              <StarRating rating={expert.averageRating} />
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>{expert.ratingCount} reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Button */}
        <div>
          <Button
            variant="default"
            className="mt-1"
            onClick={() => onViewProfile(expert._id)}
          >
            View Profile
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>

  );
};

export default ExpertsPage;