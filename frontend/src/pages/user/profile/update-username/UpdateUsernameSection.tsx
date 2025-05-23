import React from 'react';
import { UpdateUsernameButton } from './UpdateUsernameButton';

interface UpdateUsernameSectionProps {
  className?: string;
}

export const UpdateUsernameSection: React.FC<UpdateUsernameSectionProps> = ({ className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-slate-200">Full Name</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
          Update your display name. This is how other users will see you.
        </p>
      </div>
      <UpdateUsernameButton />
    </div>
  );
};

export default UpdateUsernameSection;
