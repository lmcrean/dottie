import { useState } from "react";
import { toast } from "sonner";
import { userApi } from "@/src/api/user";
import { User } from "@/src/api/auth/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";

interface AccountFormProps {
  user: User;
}

export default function AccountForm({ user }: AccountFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userApi.update(formData);
      toast.success("Account updated successfully");
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Failed to update account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (showDeleteConfirmation || isLoading) return;
    setShowDeleteConfirmation(true);
    toast.custom(
      (t) => (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-red-200 w-full max-w-md">
          <h3 className="font-medium text-lg text-red-800">
            Confirm Account Deletion
          </h3>
          <p className="mt-2 text-gray-700">
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => {
                toast.dismiss(t);
                setShowDeleteConfirmation(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t);
                setIsLoading(true);
                setShowDeleteConfirmation(false);
                try {
                  await userApi.delete(user.id);
                  toast.success("Account deleted successfully");
                  await logout();
                  navigate("/");
                } catch (error) {
                  console.error("Error deleting account:", error);
                  toast.error("Failed to delete account");
                } finally {
                  setIsLoading(false);
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
            >
              Delete Account
            </button>
          </div>
        </div>
      ),
      {
        onAutoClose: () => setShowDeleteConfirmation(false),
        onDismiss: () => setShowDeleteConfirmation(false),
        duration: Infinity,
      }
    );
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Account"}
        </button>
      </form>

      <div className="border-t pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h2>
        <div className="bg-red-50 p-4 rounded-md border border-red-200">
          <h3 className="text-sm font-medium text-red-800">Delete Account</h3>
          <p className="mt-1 text-sm text-red-700">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={isLoading}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
