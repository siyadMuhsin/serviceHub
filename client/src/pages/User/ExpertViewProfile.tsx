import { useEffect, useState } from 'react';
import { Star, MessageCircle, Bookmark, CheckCircle, Zap, Calendar, MapPin, Shield, Clock } from 'lucide-react';
import { IExpert } from '@/Interfaces/interfaces';
import { useParams } from 'react-router-dom';
import { getExpertDetails } from '@/services/User/expert.service';
import { toast } from 'react-toastify';
import BookingModal from '@/components/User/modals/BookingModal';
import RatingsReviews from '@/components/User/ReviewRating';

export default function ExpertViewProfile() {
  const [activeTab, setActiveTab] = useState('All Projects');
  const [expertData, setExpertData] = useState<IExpert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const { expertId } = useParams();
  


  useEffect(() => {
    const fetchExpertDetails = async () => {
      try {
        const response = await getExpertDetails(expertId);
        setExpertData(response.expert);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchExpertDetails();
  }, [expertId]);

  if (!expertData) {
    return <div className="max-w-6xl mx-auto p-6 bg-white">Loading...</div>;
  }
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Calculate years of experience from the dob and experience fields
  const dobDate = new Date(expertData.dob);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - dobDate.getFullYear();
  const yearsExperience = expertData.experience || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-10">
        {/* Profile Image */}
        <div className="w-full md:w-1/3">
          <img 
            src={expertData.userId.profile_image || "/api/placeholder/400/400"} 
            alt={expertData.userId.name} 
            className="w-full rounded-lg shadow-md"
          />
        </div>
        
        {/* Profile Info */}
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold text-gray-800">{expertData.userId.name}</h1>
          
          <div className="flex items-center gap-2 mt-2 text-blue-500">
            <Zap size={20} />
            <span className="text-lg">{expertData.serviceId.name} Professional</span>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} />
              <span>{yearsExperience} Years of Experience</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={18} />
              <span>Coordinates: {expertData.location.coordinates.join(', ')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Shield size={18} />
              <span>Licensed & Insured</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={18} />
              <span>Age: {age} years</span>
            </div>
            
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} size={20} fill="#FFB800" color="#FFB800" />
              ))}
              <Star size={20} fill="#FFB800" color="#FFB800" className="fill-[50%]" />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
          <button
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center gap-2"
              onClick={openModal} // Open the modal when "Book Now" is clicked
            >
              Book Now
            </button>
            
            <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition flex items-center gap-2">
              <MessageCircle size={18} />
              Message
            </button>
            <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-full">
              <CheckCircle size={18} />
              <span>Available</span>
            </div>
          </div>
        </div>
      </div>
      {/* Project Showcase */}
      {expertData.gallery && expertData.gallery.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Showcase</h2>
          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertData.gallery.map((imageUrl, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden shadow-md group">
                <img
                  src={imageUrl}
                  alt={`Project ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Ratings & Reviews */}
      <RatingsReviews expertId={expertId}/>

      {isModalOpen && (
  <BookingModal
    expert={expertData}
    isOpen={isModalOpen}
    onClose={closeModal}
  />
)}
    </div>
  );
}