import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarApp: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft size={20} />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Add Event
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => (
          <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square border border-gray-100 p-2 hover:bg-gray-50 cursor-pointer"
          >
            <span className="text-sm">{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};