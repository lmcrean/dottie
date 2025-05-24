import React from 'react';
import { UpdateEmailButton } from './UpdateEmailButton';

interface UpdateEmailSectionProps {
  className?: string;
}

export const UpdateEmailSection: React.FC<UpdateEmailSectionProps> = ({ className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-slate-200">Email Address</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
          Update your email address. You&apos;ll need to verify your new email address.
        </p>
      </div>
      <UpdateEmailButton />
    </div>
  );
};

export default UpdateEmailSection;
