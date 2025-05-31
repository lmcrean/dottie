import { UserProfile } from '@/src/pages/user/api/types';

export interface AccountFormData {
  name: string;
  email: string;
}

export interface AccountFormProps {
  user: UserProfile | null; // Replaced any with proper User type
  onUpdate: (data: AccountFormData) => Promise<void>;
  isLoading: boolean;
}

export interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}
