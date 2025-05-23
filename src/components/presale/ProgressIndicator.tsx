
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  value: number; // 0-10 scale
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  value, 
  size = 'md',
  showLabel = true 
}) => {
  const sanitizedValue = Math.max(0, Math.min(10, value)); // Ensure value is between 0-10
  const displayValue = sanitizedValue; // Value to display in the label
  
  // For the progress bar, we convert to percentage (0-100)
  // When value is 0, we want to show a thin outline, so we use 0% width
  const percentage = sanitizedValue === 0 ? 0 : sanitizedValue * 10;
  
  // Determine color and outline based on progress value
  const getProgressClasses = () => {
    if (sanitizedValue === 0) return 'border border-gray-300 bg-transparent';
    if (percentage < 40) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Determine size
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-2 w-24';
      case 'lg': return 'h-6 w-48';
      default: return 'h-4 w-36';
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full flex justify-center">
        <div 
          className={`${getSizeClasses()} ${sanitizedValue === 0 ? 'border-gray-300 border' : 'bg-gray-200'} rounded-full overflow-hidden`}
        >
          <div 
            className={`h-full ${getProgressClasses()} transition-all duration-500 rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      {showLabel && (
        <div className="mt-2 text-center font-medium">
          {displayValue}/10
        </div>
      )}
    </div>
  );
};
