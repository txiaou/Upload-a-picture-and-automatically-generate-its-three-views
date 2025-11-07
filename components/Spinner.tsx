
import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <p className="text-gray-400">AI is thinking...</p>
    </div>
  );
};
