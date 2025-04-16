
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
  const percentage = sanitizedValue * 10; // Convert to percentage (0-100)
  
  // Determine color based on progress value
  const getProgressColor = () => {
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
      <div className="relative w-full">
        <Progress 
          value={percentage} 
          className={`${getSizeClasses()} bg-gray-700 rounded-full overflow-hidden`}
        />
        <div 
          className={`absolute left-0 top-0 h-full ${getProgressColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-2 text-center font-medium">
          {sanitizedValue}/10
        </div>
      )}
    </div>
  );
};
