
import React from 'react';
import type { GeneratedViews } from '../types';

interface ResultViewerProps {
  views: GeneratedViews;
}

const ViewCard: React.FC<{ title: string; imageUrl: string | null }> = ({ title, imageUrl }) => {
  return (
    <div className="flex flex-col items-center p-2 bg-gray-900 rounded-md">
      {imageUrl ? (
        <img src={`data:image/png;base64,${imageUrl}`} alt={`${title} view`} className="w-full h-auto object-contain rounded-md aspect-square" />
      ) : (
        <div className="w-full h-auto bg-gray-700 rounded-md aspect-square flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      )}
      <p className="mt-2 text-sm font-medium text-gray-300">{title} View</p>
    </div>
  );
};

export const ResultViewer: React.FC<ResultViewerProps> = ({ views }) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
      <ViewCard title="Front" imageUrl={views.front} />
      <ViewCard title="Side" imageUrl={views.side} />
      <ViewCard title="Top" imageUrl={views.top} />
    </div>
  );
};
