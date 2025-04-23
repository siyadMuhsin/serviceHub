// src/components/User/modals/ChatModal.tsx
import { useEffect, useState, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: string;
  expertName: string;
  userId: string;
  userName: string;
}

export default function ChatModal({
  isOpen,
  onClose,
  expertId,
  expertName,
  userId,
  userName,
}: ChatModalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!isOpen) return;

    // Connect to Socket.IO server
    socketRef.current = io(import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3001', {
      query: { userId, expertId },
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    socketRef.current.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('previousMessages', (previousMessages) => {
      setMessages(previousMessages);
    });

    socketRef.current.on('error', (error) => {
      toast.error(error.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isOpen, expertId, userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      const message = {
        sender: userId,
        receiver: expertId,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };

      socketRef.current.emit('message', message);
      setNewMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-blue-500" />
            <h3 className="font-semibold">Chat with {expertName}</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.sender === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender === userId ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}