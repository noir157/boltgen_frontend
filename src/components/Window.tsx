import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useStore } from '../store';
import { DOCK_HEIGHT } from './Dock';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  position,
  size,
  isMinimized,
  isMaximized,
}) => {
  const {
    removeWindow,
    minimizeWindow,
    maximizeWindow,
    setActiveWindow,
    updateWindowPosition,
    updateWindowSize,
    activeWindow,
  } = useStore();

  useEffect(() => {
    // Ensure window is within bounds on mount and window resize
    const handleResize = () => {
      const maxY = window.innerHeight - DOCK_HEIGHT - size.height;
      const maxX = window.innerWidth - size.width;
      
      if (position.y > maxY || position.x > maxX) {
        updateWindowPosition(id, {
          x: Math.min(position.x, maxX),
          y: Math.min(position.y, maxY)
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [id, position, size, updateWindowPosition]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveWindow(id);
  };

  if (isMinimized) return null;

  const maximizedStyle = {
    position: { x: 0, y: 8 }, 
    size: {
      width: window.innerWidth,
      height: window.innerHeight - 8 - DOCK_HEIGHT
    }
  };

  const handleDragStop = (e: any, d: { x: number; y: number }) => {
    if (!isMaximized) {
      const maxY = window.innerHeight - DOCK_HEIGHT - size.height;
      const maxX = window.innerWidth - size.width;
      
      updateWindowPosition(id, {
        x: Math.min(Math.max(0, d.x), maxX),
        y: Math.min(Math.max(0, d.y), maxY)
      });
    }
  };

  const handleResizeStop = (e: any, direction: any, ref: any, delta: any, position: { x: number; y: number }) => {
    if (!isMaximized) {
      const newWidth = parseInt(ref.style.width);
      const newHeight = parseInt(ref.style.height);
      const maxY = window.innerHeight - DOCK_HEIGHT - newHeight;
      const maxX = window.innerWidth - newWidth;

      updateWindowSize(id, {
        width: newWidth,
        height: newHeight
      });

      updateWindowPosition(id, {
        x: Math.min(Math.max(0, position.x), maxX),
        y: Math.min(Math.max(0, position.y), maxY)
      });
    }
  };

  return (
    <Rnd
      position={isMaximized ? maximizedStyle.position : position}
      size={isMaximized ? maximizedStyle.size : size}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      dragHandleClassName="window-handle"
      enableResizing={!isMaximized}
      disableDragging={isMaximized}
      minWidth={300}
      minHeight={200}
      bounds="window"
      style={{ 
        position: 'fixed',
        zIndex: activeWindow === id ? 50 : 40,
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-full border border-white/20 dark:border-white/10 ${
          activeWindow === id ? 'ring-1 ring-white/20' : ''
        } ${isMaximized ? 'rounded-none' : ''}`}
        onClick={handleClick}
      >
        <div className="window-handle h-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl flex items-center justify-between px-3 cursor-move border-b border-white/10 dark:border-white/5">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeWindow(id);
              }}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(id);
              }}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(id);
              }}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
            />
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-sm text-gray-600 dark:text-gray-300 font-medium">
            {title}
          </div>
          <div className="w-16" />
        </div>
        <div className="flex-1 overflow-auto relative bg-gray-50/50 dark:bg-gray-900/50">
          {React.isValidElement(children) ? children : null}
        </div>
      </motion.div>
    </Rnd>
  );
};