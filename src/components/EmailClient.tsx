import React from 'react';
import { Mail, Star, Clock, Send, Trash2, Inbox } from 'lucide-react';

export const EmailClient: React.FC = () => {
  return (
    <div className="h-full flex">
      <div className="w-48 bg-gray-50 p-4 space-y-2">
        <button className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
          <Inbox size={18} />
          <span>Inbox</span>
        </button>
        <button className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
          <Star size={18} />
          <span>Starred</span>
        </button>
        <button className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
          <Send size={18} />
          <span>Sent</span>
        </button>
        <button className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
          <Clock size={18} />
          <span>Snoozed</span>
        </button>
        <button className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
          <Trash2 size={18} />
          <span>Trash</span>
        </button>
      </div>
      
      <div className="flex-1 p-4">
        <div className="text-center py-8">
          <Mail size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No messages in your inbox</p>
        </div>
      </div>
    </div>
  );
};