
import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GameControls: React.FC = () => {
  const dispatchArrowKey = (direction: string) => {
    const event = new KeyboardEvent('keydown', {
      key: `Arrow${direction}`
    });
    window.dispatchEvent(event);
  };
  
  return (
    <div className="mt-4 mb-2 flex justify-center">
      <div className="grid grid-cols-3 grid-rows-3 gap-2">
        <div className="col-start-2">
          <button
            className="neo-brutal-button p-4 flex items-center justify-center w-16 h-16"
            onClick={() => dispatchArrowKey('Up')}
          >
            <ArrowUp size={24} />
          </button>
        </div>
        <div className="col-start-1 row-start-2">
          <button
            className="neo-brutal-button p-4 flex items-center justify-center w-16 h-16"
            onClick={() => dispatchArrowKey('Left')}
          >
            <ArrowLeft size={24} />
          </button>
        </div>
        <div className="col-start-3 row-start-2">
          <button
            className="neo-brutal-button p-4 flex items-center justify-center w-16 h-16"
            onClick={() => dispatchArrowKey('Right')}
          >
            <ArrowRight size={24} />
          </button>
        </div>
        <div className="col-start-2 row-start-3">
          <button
            className="neo-brutal-button p-4 flex items-center justify-center w-16 h-16"
            onClick={() => dispatchArrowKey('Down')}
          >
            <ArrowDown size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
