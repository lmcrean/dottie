import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { assessmentApi } from '@/src/pages/assessment/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { useTheme } from '@/src/context/theme/useTheme';

interface DeleteButtonProps {
  assessmentId: string;
  className?: string;
}

export default function DeleteButton({ assessmentId, className = '' }: DeleteButtonProps) {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const bgColor = isDarkMode ? 'bg-black-100 text-white' : 'bg-white text-black';

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await assessmentApi.delete(assessmentId);
      toast.success('Assessment deleted successfully');
      navigate('/assessment/history');
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('Failed to delete assessment');
    } finally {
      closeDeleteModal();
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openDeleteModal}
        className={`rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 ${className}`}
      >
        Delete
      </button>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <Dialog open={deleteModalOpen} onOpenChange={closeDeleteModal}>
          <DialogContent
            className={`${bgColor} max-w-md rounded-xl p-6 shadow-lg backdrop-blur-lg`}
          >
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Confirm Delete
                  </h3>
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this assessment? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                {isLoading ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
