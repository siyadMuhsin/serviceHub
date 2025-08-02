import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { IMessage } from '@/Interfaces/interfaces';
import { getConversation } from '@/services/chat.service';
import { useSelector } from 'react-redux';
// import { getUserIdAndRole } from '@/Utils/getUserIdAndRole';
import { baseUrl } from 'config/axiosConfig';
import { RootState } from '@/store';

export default function ChatPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { receiverId } = useParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState<'User' | 'Expert'>('User');
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const scrollToBottom = () => {
    // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const  id = user._id
    // console.log(id,role);
    
    setUserId(id);
    setUserRole( 'User');

    // Initialize socket
    socketRef.current = io(baseUrl, {
      autoConnect: true,
      reconnection: true,
    });

    // Join room
    socketRef.current.emit('join', id);

    // Handle incoming messages
    socketRef.current.on('receiveMessage', (message: IMessage) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    // Handle message sent confirmation
    socketRef.current.on('messageSent', (message: IMessage) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id)) return prev;
        return [...prev, message];
      });
    });


    // Handle errors
    socketRef.current.on('messageError', ({ error }) => {
      setError(error);
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (userId && receiverId) {
      fetchConversation();
    }
  }, [userId, receiverId]);

  useEffect(scrollToBottom, [messages]);

  const fetchConversation = async () => {
    try {
      const data = await getConversation(userId, receiverId as string);
      setMessages(data);
    } catch (err) {
      console.error('Error loading conversation:', err);
      setError('Failed to load conversation');
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    const messageData: Partial<IMessage> = {
      sender: userId,
      senderModel: userRole,
      receiver: receiverId!,
      receiverModel: userRole === 'User' ? 'Expert' : 'User',
      content: newMessage,
    };

    socketRef.current.emit('sendMessage', messageData);
    socketRef.current.emit('stopTyping');
    setNewMessage('');
  };

  const handleTyping = () => {
    if (!socketRef.current) return;
    
    if (newMessage.trim()) {
      socketRef.current.emit('typing');
    } else {
      socketRef.current.emit('stopTyping');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Chat</h1>
         
          </div>
        </div>
       
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg">Start a conversation</p>
            <p className="text-sm">Send your first message below</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender.toString() === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl transition-all duration-200 ${
                  msg.sender.toString() === userId
                    ? 'bg-indigo-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender.toString() === userId ? 'text-indigo-100' : 'text-gray-500'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
    
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-2 rounded-md mb-3 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        <div className="flex items-center space-x-2">
        
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full ${
              newMessage.trim()
                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } transition-colors duration-200`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}