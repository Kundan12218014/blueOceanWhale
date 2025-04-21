import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, MoreVertical, UserMinus, LogOut, Edit2, Camera, Check, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import MessageInput from './MessageInput';
import MessageBubble from './MessageBubble';
import { Message } from '../../types';
import { getChatMessages, sendMessage, getChatRoom, removeContact, leaveGroupChat, updateGroupName, updateGroupPhoto } from '../../services/chat';
import { getUserProfile } from '../../services/user';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [newPhotoURL, setNewPhotoURL] = useState('');
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth() || {};
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editNameInputRef = useRef<HTMLInputElement>(null);
  const editPhotoInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null); // Ref for options menu

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    const loadChatRoom = async () => {
      try {
        const room = await getChatRoom(roomId);
        if (room) {
          setChatInfo(room);
          if (room.type === 'private') {
            const otherUserId = room.participants.find(id => id !== currentUser?.uid);
            if (otherUserId) {
              const userProfile = await getUserProfile(otherUserId);
              setContactInfo(userProfile);
            }
          }
        } else {
          toast.error('Chat room not found');
        }
      } catch (error) {
        console.error('Error loading chat room:', error);
        toast.error('Failed to load chat room');
      } finally {
        setLoading(false);
      }
    };

    loadChatRoom();

    const unsubscribe = getChatMessages(roomId, (newMessages) => {
      setMessages(newMessages);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => {
      unsubscribe();
    };
  }, [roomId, currentUser]);

  useEffect(() => {
    if (isEditingName && editNameInputRef.current) {
      editNameInputRef.current.focus();
    }
  }, [isEditingName]);

  // Close options menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef]);

  const handleSendMessage = async (text: string) => {
    if (!currentUser || !roomId || !text.trim()) return;

    try {
      await sendMessage({
        roomId,
        text: text.trim(),
        senderId: currentUser.uid,
        timestamp: new Date(),
        type: 'text',
        read: false
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleRemoveContact = async () => {
    if (!currentUser?.uid || !contactInfo?.uid) return;

    try {
      await removeContact(currentUser.uid, contactInfo.uid);
      toast.success('Contact removed successfully');
      navigate('/');
    } catch (error) {
      console.error('Error removing contact:', error);
      toast.error('Failed to remove contact');
    }
  };

  const handleLeaveGroup = async () => {
    if (!currentUser?.uid || !roomId) return;

    try {
      await leaveGroupChat(roomId, currentUser.uid);
      toast.success('Left group successfully');
      navigate('/');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group');
    }
  };

  const handleUpdateGroupName = async () => {
    if (!roomId || !newGroupName.trim()) {
      setIsEditingName(false);
      return;
    }

    try {
      await updateGroupName(roomId, newGroupName.trim());
      setChatInfo(prev => ({
        ...prev,
        groupInfo: { ...prev.groupInfo, name: newGroupName.trim() }
      }));
      toast.success('Group name updated successfully');
      setIsEditingName(false);
    } catch (error) {
      toast.error('Failed to update group name');
    }
  };

  const handleUpdateGroupPhoto = async () => {
    if (!roomId || !newPhotoURL.trim()) {
      setIsEditingPhoto(false);
      return;
    }

    try {
      await updateGroupPhoto(roomId, newPhotoURL.trim());
      setChatInfo(prev => ({
        ...prev,
        groupInfo: { ...prev.groupInfo, photoURL: newPhotoURL.trim() }
      }));
      toast.success('Group photo updated successfully');
      setIsEditingPhoto(false);
    } catch (error) {
      toast.error('Failed to update group photo');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'name' | 'photo') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'name') {
        handleUpdateGroupName();
      } else {
        handleUpdateGroupPhoto();
      }
    } else if (e.key === 'Escape') {
      if (type === 'name') {
        setIsEditingName(false);
        setNewGroupName(chatInfo?.groupInfo?.name || '');
      } else {
        setIsEditingPhoto(false);
        setNewPhotoURL(chatInfo?.groupInfo?.photoURL || '');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!roomId || !chatInfo) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <img
              src={chatInfo.type === 'group' ? chatInfo.groupInfo?.photoURL : contactInfo?.photoURL || 'https://via.placeholder.com/40'}
              alt="Contact"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => chatInfo.type === 'group' && setIsEditingPhoto(true)}
            />
            {chatInfo.type === 'group' && (
              <button
                onClick={() => setIsEditingPhoto(true)}
                className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          <div>
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  ref={editNameInputRef}
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, 'name')}
                  className="px-2 py-1 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter group name"
                />
                <button
                  onClick={handleUpdateGroupName}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-green-500"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsEditingName(false);
                    setNewGroupName(chatInfo?.groupInfo?.name || '');
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold dark:text-white">
                  {chatInfo.type === 'group' 
                    ? chatInfo.groupInfo?.name 
                    : contactInfo?.displayName || 'Unknown Contact'}
                </h3>
                {chatInfo.type === 'group' && (
                  <button
                    onClick={() => {
                      setIsEditingName(true);
                      setNewGroupName(chatInfo?.groupInfo?.name || '');
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {contactInfo?.online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Phone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Video className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="relative">
            <button 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              onClick={(e) => {
                e.stopPropagation(); // Prevent immediate closing
                setShowOptions(!showOptions);
              }}
            >
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10" ref={optionsRef}>
                {chatInfo.type === 'private' ? (
                  <button
                    onClick={handleRemoveContact}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <UserMinus className="w-4 h-4 mr-2" />
                    Remove Contact
                  </button>
                ) : (
                  <button
                    onClick={handleLeaveGroup}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave Group
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditingPhoto && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Update Group Photo</h3>
            <input
              ref={editPhotoInputRef}
              type="text"
              value={newPhotoURL}
              onChange={(e) => setNewPhotoURL(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, 'photo')}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4"
              placeholder="Enter photo URL"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditingPhoto(false);
                  setNewPhotoURL(chatInfo?.groupInfo?.photoURL || '');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateGroupPhoto}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
