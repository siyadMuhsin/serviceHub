import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IMessage, IUser } from '@/Interfaces/interfaces';
import { getConversationToUser, getChatUsers } from '@/services/chat.service';
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
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

        // Set up all socket listeners here
        setupSocketListeners();
      } catch (err) {
        console.error("Failed to fetch expert or connect socket:", err);
      }
    };
  
    fetchExpertAndInitSocket();
  
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  
  const setupSocketListeners = () => {
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

    socketRef.current.on('userOnline', (userId: string) => {
      setOnlineUsers(prev => [...new Set([...prev, userId])]);
    });

    socketRef.current.on('userOffline', (userId: string) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    socketRef.current.on('typingStart', (userId: string) => {
      if (userId === receiverId) {
        setTypingUsers(prev => [...new Set([...prev, userId])]);
      }
    });

    socketRef.current.on('typingStop', (userId: string) => {
      setTypingUsers(prev => prev.filter(id => id !== userId));
    });

    socketRef.current.on('onlineUsers', (users: string[]) => {
      setOnlineUsers(users);
    });
  };

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
  }, [messages, typingUsers]);

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
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleTyping = () => {
    if (!socketRef.current || !receiverId) return;

    if (!isTyping) {
      socketRef.current.emit('typingStart', receiverId);
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('typingStop', receiverId);
      setIsTyping(false);
    }, 2000);
  };

  const getOnlineStatus = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Mobile menu button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg"
      >
        {showSidebar ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        md:translate-x-0 fixed md:relative inset-y-0 left-0 z-40 w-64 bg-white shadow-lg p-4 overflow-y-auto transition-transform duration-300 ease-in-out md:transition-none`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Users</h2>
        {chatUsers.map((user) => (
          <div
            key={user._id}
            className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${
              receiverId === user._id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => setReceiverId(user._id)}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {getOnlineStatus(user._id) && (
                <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 font-medium truncate">{user.name}</p>
              {typingUsers.includes(user._id) && (
                <p className="text-xs text-gray-500 italic truncate">typing...</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {receiverId ? (
          <>
            {/* Chat header */}
            <div className="bg-white p-4 border-b flex items-center shadow-sm">
              <button 
                onClick={() => setReceiverId('')}
                className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="flex items-center">
                <div className="relative mr-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                   
                    {chatUsers.find(u => u._id === receiverId)?.name.charAt(0).toUpperCase()}
                  </div>
                  {getOnlineStatus(receiverId) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {chatUsers.find(u => u._id === receiverId)?.name || 'Chat'}
                  </h2>
                  <div className="text-xs text-gray-500">
                    {typingUsers.includes(receiverId) ? (
                      <span className="text-blue-500">typing...</span>
                    ) : getOnlineStatus(receiverId) ? (
                      <span className="text-green-500">online</span>
                    ) : (
                      <span>offline</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg m-4">
                {error}
              </div>
            )}
            
            {/* Messages container */}
            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
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
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === userId ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {typingUsers.includes(receiverId) && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] p-3 rounded-2xl bg-white text-gray-800 border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>
            
            {/* Message input */}
            <div className="bg-white border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Type your message..."
                  disabled={!receiverId}
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 flex items-center justify-center"
                  disabled={!receiverId || !newMessage.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4">
            <div className="text-center max-w-md">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              {chatUsers.length > 0 ? (
                <>
                  <h3 className="text-xl font-medium mb-2 text-gray-700">No conversation selected</h3>
                  <p className="mb-4">Select a user from the sidebar to start chatting</p>
                  <button 
                    onClick={() => setShowSidebar(true)}
                    className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Show Users
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-medium mb-2 text-gray-700">No users available</h3>
                  <p>You don't have any chat conversations yet</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}