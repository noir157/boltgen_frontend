import React from 'react';
import { Play, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1">
        <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 animate-spin-slow" />
        </div>
        
        <div className="text-center mb-4">
          <h3 className="font-medium">No music playing</h3>
          <p className="text-sm text-gray-500">Select a song to play</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Shuffle size={20} className="text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <SkipBack size={20} />
          </button>
          <button className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600">
            <Play size={24} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <SkipForward size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Repeat size={20} className="text-gray-400" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Volume2 size={20} className="text-gray-400" />
          <div className="flex-1 h-1 bg-gray-200 rounded-full">
            <div className="w-1/2 h-full bg-blue-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};