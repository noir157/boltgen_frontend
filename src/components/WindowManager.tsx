import React from 'react';
import { Window } from './Window';
import { useStore } from '../store';

export const WindowManager: React.FC = () => {
  const { windows } = useStore();

  return (
    <div className="relative w-full h-full">
      {windows.map((window) => (
        <Window key={window.id} {...window}>
          {window.content}
        </Window>
      ))}
    </div>
  );
};