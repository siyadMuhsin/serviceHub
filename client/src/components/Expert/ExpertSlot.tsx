import React, { useState, useEffect } from 'react';
import { createSlot, deleteSlot, getExpertSlot } from '@/services/Expert/slot.service';
import { toast } from 'react-toastify';
import ConfirmModal from '@/Utils/Confirmation';

interface Slot {
  _id: string;
  date: string;
  timeSlots: string[];
  createdAt: string;
}

const ExpertSlot: React.FC = () => {
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>(['']);
  const [createdSlots, setCreatedSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    slotId: '',
    message: ''
  });

  // Fetch existing slots on component mount
  useEffect(() => {
    const fetchSlots = async () => {
      setIsFetching(true);
      try {
        const res = await getExpertSlot();
        setCreatedSlots(res.slots);
      } catch (err: any) {
        console.error('Failed to fetch slots', err);
        toast.error(err.response?.data?.message || 'Failed to fetch slots');
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchSlots();
  }, []);

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, '']);
  };

  const handleChangeTime = (index: number, value: string) => {
    const newSlots = [...timeSlots];
    newSlots[index] = value;
    setTimeSlots(newSlots);
  };

  const handleRemoveTimeSlot = (index: number) => {
    const newSlots = [...timeSlots];
    newSlots.splice(index, 1);
    setTimeSlots(newSlots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validTimeSlots = timeSlots.filter(slot => slot.trim() !== '');
    if (validTimeSlots.length === 0) {
      toast.error('Please add at least one time slot');
      return;
    }

    setIsLoading(true);
    try {
      const res = await createSlot({
        date,
        timeSlots: validTimeSlots
      });
      
      toast.success(res.message || 'Slot created successfully');
      setDate('');
      setTimeSlots(['']);
      
      if (res.data) {
        setCreatedSlots(prev => [
          {
            _id: res.data._id,
            date: res.data.date,
            timeSlots: res.data.timeSlots,
            createdAt: res.data.createdAt || new Date().toISOString()
          },
          ...prev
        ]);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create slot');
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteConfirm = (slotId: string) => {
    const slotToDelete = createdSlots.find(slot => slot._id === slotId);
    if (slotToDelete) {
      setDeleteModal({
        isOpen: true,
        slotId,
        message: `Are you sure you want to delete the slot for ${new Date(slotToDelete.date).toLocaleDateString()} with ${slotToDelete.timeSlots.length} time slot(s)?`
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      await deleteSlot(deleteModal.slotId);
      setCreatedSlots(prev => prev.filter(slot => slot._id !== deleteModal.slotId));
      toast.success('Slot deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete slot', err);
      toast.error(err?.message || 'Failed to delete slot');
    } finally {
      setIsLoading(false);
      setDeleteModal({
        isOpen: false,
        slotId: '',
        message: ''
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      slotId: '',
      message: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-full max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Manage Your Availability</h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Create Slot Form */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">Create New Slot</h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-gray-600 font-medium mb-2">Time Slots</label>
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={slot}
                    onChange={(e) => handleChangeTime(index, e.target.value)}
                    required={index === 0}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTimeSlot(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                      aria-label="Remove time slot"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddTimeSlot}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 mt-2"
              >
                <span>+ Add another time slot</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : 'Create Availability Slot'}
            </button>
          </form>
        </div>

        {/* Existing Slots */}
        <div>
          <h4 className="text-xl font-semibold text-gray-700 mb-4">Your Availability Slots</h4>
          
          {isFetching ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : createdSlots.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-500">No availability slots created yet</p>
              <p className="text-sm text-gray-400 mt-2">Create your first slot using the form</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {createdSlots.map((slot) => (
                <div key={slot._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-gray-800">
                        {new Date(slot.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h5>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {slot.timeSlots.map((time, i) => (
                          <span 
                            key={i} 
                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            <span className="w-5">{time}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => openDeleteConfirm(slot._id)}
                      disabled={isLoading}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                      aria-label="Delete slot"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs mt-3">
                    Created: {new Date(slot.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        message={deleteModal.message}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}

      />
    </div>
  );
};

export default ExpertSlot;