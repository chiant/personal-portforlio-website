import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Trash2, 
  Eye, 
  EyeOff, 
  Reply, 
  Archive, 
  RefreshCw,
  Search,
  Filter,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';
import { VisitorMessage, MessageStorage } from '../../types';
import { dataService } from '../../services/dataService';

const MessageManagement: React.FC = () => {
  const [messages, setMessages] = useState<VisitorMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<VisitorMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    setLoading(true);
    const messageStorage = dataService.getMessages();
    setMessages(messageStorage.messages);
    setLoading(false);
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (messageId: string, newStatus: VisitorMessage['status']) => {
    const result = await dataService.updateMessageStatus(messageId, newStatus);
    if (result.success) {
      loadMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    const result = await dataService.deleteMessage(messageId);
    if (result.success) {
      loadMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteAllMessages = async () => {
    if (window.confirm('Are you sure you want to delete all messages? This action cannot be undone.')) {
      const result = await dataService.deleteAllMessages();
      if (result.success) {
        loadMessages();
        setSelectedMessage(null);
      }
    }
  };

  const getStatusColor = (status: VisitorMessage['status']) => {
    switch (status) {
      case 'unread': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-gray-100 text-gray-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: VisitorMessage['status']) => {
    switch (status) {
      case 'unread': return <Mail className="w-4 h-4" />;
      case 'read': return <Eye className="w-4 h-4" />;
      case 'replied': return <Reply className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
            Visitor Messages
          </h3>
          <p className="text-sm text-secondary-600 dark:text-white">
            {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''} 
            {statusFilter !== 'all' && ` (${statusFilter})`}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={loadMessages}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          
          {messages.length > 0 && (
            <button
              onClick={handleDeleteAllMessages}
              className="btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-secondary-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <div className="card">
            <h4 className="font-semibold text-secondary-900 dark:text-white mb-4">
              Messages ({filteredMessages.length})
            </h4>
            
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                <p className="text-secondary-600 dark:text-white">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No messages match your filters' 
                    : 'No messages yet'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-secondary-50 dark:hover:bg-secondary-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-secondary-900 dark:text-white truncate">
                          {message.name}
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-white truncate">
                          {message.email}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(message.status)}`}>
                        {getStatusIcon(message.status)}
                        <span className="hidden sm:inline">{message.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium text-secondary-900 dark:text-white mb-1 truncate">
                      {message.subject}
                    </p>
                    
                    <p className="text-xs text-secondary-500 dark:text-white">
                      {formatDate(message.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                    {selectedMessage.subject}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-secondary-600 dark:text-white">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{selectedMessage.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedMessage.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(selectedMessage.status)}`}>
                  {getStatusIcon(selectedMessage.status)}
                  <span>{selectedMessage.status}</span>
                </span>
              </div>

              <div className="mb-6">
                <h5 className="font-medium text-secondary-900 dark:text-white mb-2">Message:</h5>
                <div className="p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                  <p className="text-secondary-700 dark:text-white whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                {selectedMessage.status === 'unread' && (
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Mark as Read</span>
                  </button>
                )}
                
                {selectedMessage.status !== 'replied' && (
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Mark as Replied</span>
                  </button>
                )}
                
                {selectedMessage.status !== 'archived' && (
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Archive</span>
                  </button>
                )}
                
                <button
                  onClick={() => setShowDeleteConfirm(selectedMessage.id)}
                  className="btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                  Select a Message
                </h4>
                <p className="text-secondary-600 dark:text-white">
                  Choose a message from the list to view its details and manage it.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Delete Message
            </h3>
            <p className="text-secondary-600 dark:text-white mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(showDeleteConfirm)}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageManagement;
