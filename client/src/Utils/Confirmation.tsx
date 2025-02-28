import { useState, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Confirm Action",
  message,
  onConfirm,
  onCancel,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300 backdrop-blur-md ${
          isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-lg shadow-2xl w-96 max-w-full transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        } text-white`}
      >
        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <FaExclamationTriangle className="text-yellow-300 text-2xl" />
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        {/* Modal Body */}
        <p className="text-lg font-medium mb-6">{message}</p>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;