import React from 'react';
import { Folder, ChevronRight } from 'lucide-react';

interface FileProps {
  name: string;
  type: 'file' | 'folder';
  icon: React.ReactNode;
}

interface FileExplorerProps {
  files: FileProps[];
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ files }) => {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronRight size={20} className="text-gray-400" />
        </button>
        <div className="text-sm text-gray-500">Home</div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="p-4 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer group"
          >
            <div className="aspect-square bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:shadow-md transition-shadow duration-200">
              {file.icon}
            </div>
            <div className="text-sm font-medium text-center truncate">{file.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};