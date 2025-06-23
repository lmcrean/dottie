import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog.tsx';
import { DeleteConfirmationDialogProps } from './types';
import { useTheme } from '@/src/context/theme/useTheme.ts';

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading
}) => {
  const { isDarkMode } = useTheme();
  const bgColor = isDarkMode
    ? 'bg-black-100 text-white border-white/10'
    : 'bg-white text-black border-gray-200';
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        className={`${bgColor} max-w-md rounded-xl border border-border p-8 shadow-lg backdrop-blur-lg`}
      >
        <DialogHeader>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete your account?This action cannot be undone. </p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border px-4 py-2 text-sm font-medium hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {isLoading ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
