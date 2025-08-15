import React from 'react';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

export function PlaceholderImage({ 
  width = 800, 
  height = 600, 
  className = "", 
  alt = "Placeholder" 
}: PlaceholderImageProps) {
  return (
    <div 
      className={`bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">TaskFusion App Preview</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{width} × {height}</p>
      </div>
    </div>
  );
}
