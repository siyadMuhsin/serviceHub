import { fetchSavedService, unsaveService } from '@/services/User/profile.service';
import { Card, CardContent, Button, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ConfirmationModal } from '../ConfirmModal';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '@/Slice/authSlice';
import { RootState } from '@/store';
import { Link } from 'react-router-dom';
import { IServices } from '@/Interfaces/interfaces';


const SavedServices = () => {
  const [services, setServices] = useState<IServices[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const savedServices = useSelector((state: RootState) => state.auth.user?.savedServices || []);
const dispatch=useDispatch()
  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetchSavedService();
      setServices(response.services || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch saved services");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveClick = (serviceId: string) => {
    setSelectedService(serviceId);
    setModalOpen(true);
  };

  const handleConfirmUnsave = async () => {
    if (!selectedService) return;
    
    try {
      await unsaveService(selectedService);
      toast.success("Service removed from saved list");
      const updatedSavedServices = savedServices.filter(id => id !== selectedService);
      dispatch(updateUser({ savedServices: updatedSavedServices }));
      setServices(prev => prev.filter(service => service._id !== selectedService));

    } catch (error) {
      toast.error(error.message || "Failed to unsave service");
    } finally {
      setModalOpen(false);
      setSelectedService(null);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedService(null);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
      <Card className="mb-6 ">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Saved Services</h3>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </Box>
          ) : services.length === 0 ? (
            <p className="text-gray-500">No saved services yet.</p>
          ) : (
            services.map(service => (
                <div key={service._id} className="flex justify-between items-start mb-4 border-b pb-3 last:border-b-0">
                  <Link to={`/services/${service._id}`} className="flex-1">
                    <h4 className="text-md font-bold">{service.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  </Link>
                  <div className="pl-4">
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small" 
                      onClick={() => handleUnsaveClick(service._id)} 
                      className="mt-1"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
          )}
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmUnsave}
        title="Confirm Removal"
        description="Are you sure you want to remove this service from your saved list?"
        confirmText="Remove"
        cancelText="Cancel"
      />
    </Box>
  );
};

export default SavedServices;