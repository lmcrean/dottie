import React from 'react';

interface FlowLevelProps {
  flowLevel: string | null;
}

export const FlowLevel = ({ flowLevel }: FlowLevelProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:border dark:border-slate-700 dark:bg-slate-800">
      <div>
        <img src="/resultAssets/d-drop.svg" className="h-[55px] w-[55px]" alt="d-drop-icon" />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-medium dark:text-slate-100">Flow Level</h3>
        <p className="text-gray-600 dark:text-slate-200" data-testid="flow-level-value">
          {flowLevel || 'Not specified'}
        </p>
      </div>
    </div>
  );
};
