import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { useTheme } from '@/src/context/theme/useTheme';
import { X } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading
}) => {
  const { isDarkMode } = useTheme();
  const bgColor = isDarkMode ? 'bg-black-100 text-white' : 'bg-white text-black';
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className={`${bgColor} max-w-md rounded-xl p-6 shadow-lg backdrop-blur-lg`}>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Confirm Delete</h3>
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete your account? This action cannot be undone.{' '}
        </p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {isLoading ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
