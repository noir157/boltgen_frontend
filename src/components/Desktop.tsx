import React from 'react';

export const Desktop: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="fixed inset-0 pt-7 pb-20 overflow-hidden">
      {children}
    </div>
  );
};