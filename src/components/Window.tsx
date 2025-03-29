import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useStore } from '../store';
import { DOCK_HEIGHT } from './Dock';
import { useTranslation } from 'react-i18next';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  translationKey?: string;
  appType: string;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  position,
  size,
  isMinimized,
  isMaximized,
  translationKey,
  appType
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
  const { t } = useTranslation();
  const [dockItemRect, setDockItemRect] = useState<DOMRect | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);

  const getDockItemRect = useCallback(() => {
    const dockItem = document.querySelector(`[data-app-type="${appType}"]`);
    if (dockItem) {
      setDockItemRect(dockItem.getBoundingClientRect());
    }
  }, [appType]);

  useEffect(() => {
    getDockItemRect();
    const resizeObserver = new ResizeObserver(getDockItemRect);
    const dockItem = document.querySelector(`[data-app-type="${appType}"]`);
    if (dockItem) {
      resizeObserver.observe(dockItem);
    }
    return () => resizeObserver.disconnect();
  }, [getDockItemRect]);

  useEffect(() => {
    if (!isDragging) {
      setCurrentPosition(position);
    }
  }, [position, isDragging]);

  const handleDragStart = () => {
    setIsDragging(true);
    setActiveWindow(id);
  };

  const handleDrag = (e: any, d: { x: number; y: number }) => {
    if (!isMaximized) {
      const maxY = window.innerHeight - DOCK_HEIGHT - size.height;
      const maxX = window.innerWidth - size.width;
      const newX = Math.min(Math.max(0, d.x), maxX);
      const newY = Math.min(Math.max(0, d.y), maxY);
      
      setCurrentPosition({ x: newX, y: newY });
    }
  };

  const handleDragStop = () => {
    setIsDragging(false);
    if (!isMaximized) {
      updateWindowPosition(id, currentPosition);
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

  const maximizedStyle = {
    position: { x: 0, y: 8 },
    size: {
      width: window.innerWidth,
      height: window.innerHeight - 8 - DOCK_HEIGHT
    }
  };

  const displayTitle = translationKey ? t(translationKey) : title;

  const getInitialPosition = () => {
    if (!dockItemRect) return { x: position.x, y: position.y };
    return {
      x: dockItemRect.left,
      y: window.innerHeight - DOCK_HEIGHT
    };
  };

  const getFinalPosition = () => {
    if (isMinimized && dockItemRect) {
      return {
        x: dockItemRect.left,
        y: window.innerHeight - DOCK_HEIGHT
      };
    }
    return currentPosition;
  };

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          initial={getInitialPosition()}
          animate={getFinalPosition()}
          exit={getInitialPosition()}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8
          }}
          style={{
            position: 'fixed',
            width: size.width,
            height: size.height,
            zIndex: activeWindow === id ? 50 : 40,
            willChange: 'transform'
          }}
        >
          <Rnd
            position={isMaximized ? maximizedStyle.position : currentPosition}
            size={isMaximized ? maximizedStyle.size : size}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            dragHandleClassName="window-handle"
            enableResizing={!isMaximized}
            disableDragging={isMaximized}
            minWidth={300}
            minHeight={200}
            bounds="window"
            style={{ 
              position: 'absolute',
              transform: 'none'
            }}
          >
            <div
              className={`bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-full border border-white/20 dark:border-white/10 ${
                activeWindow === id ? 'ring-1 ring-white/20' : ''
              } ${isMaximized ? 'rounded-none' : ''}`}
              onClick={() => setActiveWindow(id)}
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
                  {displayTitle}
                </div>
                <div className="w-16" />
              </div>
              <div className="flex-1 overflow-auto relative bg-gray-50/50 dark:bg-gray-900/50">
                {children}
              </div>
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
};