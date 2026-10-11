import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
};
