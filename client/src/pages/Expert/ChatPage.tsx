import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IMessage, IUser } from '@/Interfaces/interfaces';
import { getConversationToUser, getChatUsers } from '@/services/chat.service';
// import { getUserIdAndRole } from '@/Utils/getUserIdAndRole';
import { baseUrl } from 'config/axiosConfig';
import { get_expert } from '@/services/Expert/expert.service';

export default function ExpertChatPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [chatUsers, setChatUsers] = useState<IUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  
  useEffect(() => {
    const fetchExpertAndInitSocket = async () => {
      try {
        const response = await get_expert();
        const id = response.expert._id;
        setUserId(id);
  
        socketRef.current = io(baseUrl, {
          autoConnect: true,
          reconnection: true,
        });
      } catch (err) {
        console.error("Failed to fetch expert or connect socket:", err);
      }
    };
  
    fetchExpertAndInitSocket();
  
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (!socketRef.current || !userId) return;

    socketRef.current.emit('join', userId);

    socketRef.current.on('receiveMessage', (message: IMessage) => {
      if (message.receiver === userId || message.sender === userId) {
        setMessages((prev) => {
          if (prev.some((msg) => msg._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    });

    socketRef.current.on('messageSent', (message: IMessage) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    socketRef.current.on('messageError', ({ error }) => {
      setError(error);
    });

    return () => {
      socketRef.current?.off('receiveMessage');
      socketRef.current?.off('messageSent');
      socketRef.current?.off('messageError');
    };
  }, [socketRef, userId]);

  useEffect(() => {
    if (userId) {
      fetchChatUsers(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && receiverId) {
      fetchConversationData();
      // On mobile, hide sidebar when a user is selected
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    }
  }, [receiverId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatUsers = async (id: string) => {
    try {
      const response = await getChatUsers(id);
      setChatUsers(response.users);
    } catch (error) {
      console.error('Failed to load chat users', error);
      setError('Failed to load users');
    }
  };

  const fetchConversationData = async () => {
    try {
      const response = await getConversationToUser(userId, receiverId);
      setMessages(response);
    } catch (error) {
      console.error('Error fetching conversation', error);
      setError('Failed to load conversation');
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() || !receiverId || !socketRef.current || !userId) return;

    const messageData: IMessage = {
      sender: userId,
      senderModel: 'Expert',
      receiver: receiverId,
      receiverModel: 'User',
      content: newMessage,
    };

    socketRef.current.emit('sendMessage', messageData);
    setNewMessage('');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans p-6">
      {/* Mobile menu button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed top-4 z-50 bg-white p-2 rounded-lg shadow-lg "
      >
        {showSidebar ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar - hidden on mobile unless showSidebar is true */}
      <div 
        className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:relative inset-y-0 left-0 z-40 w-64 bg-white shadow-lg p-6 overflow-y-auto transition-transform duration-300 ease-in-out md:transition-none`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Users</h2>
        {chatUsers.map((user) => (
          <div
            key={user._id}
            className={`flex items-center p-4 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${
              receiverId === user._id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => setReceiverId(user._id)}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 font-medium">{user.name}</span>
          </div>
        ))}
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col p-4 md:p-8">
        {receiverId ? (
          <>
            {/* Mobile header with back button */}
            <div className="md:hidden flex items-center mb-4">
              <button 
                onClick={() => setReceiverId('')}
                className="mr-2 p-2 rounded-full hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold">
                {chatUsers.find(u => u._id === receiverId)?.name || 'Chat'}
              </h2>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}
            <div className="flex-1 bg-white rounded-xl shadow-md p-4 md:p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.sender === userId ? 'justify-end' : 'justify-start'
                  } animate-slide-in`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl shadow-sm transition-all duration-200 ${
                      msg.sender === userId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
            <div className="mt-4 md:mt-6 flex gap-2 md:gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Type your message..."
                disabled={!receiverId}
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
                disabled={!receiverId || !newMessage.trim()}
              >
                <span className="hidden md:inline">Send</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            {chatUsers.length > 0 ? (
              <div className="text-center">
                <div className="md:hidden mb-4">
                  <p>Tap the menu button to select a user</p>
                </div>
                <div className="hidden md:block">
                  <p>Select a user to start chatting</p>
                </div>
              </div>
            ) : (
              <p>No users available to chat</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}