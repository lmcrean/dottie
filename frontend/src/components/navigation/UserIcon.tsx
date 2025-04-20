import React, { useEffect, useState } from "react";
import { User, List } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";
import { assessmentApi } from "@/src/api/assessment";

const UserIcon: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [hasHistory, setHasHistory] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAssessmentHistory = async () => {
      try {
        const assessments = await assessmentApi.list();
        setHasHistory(Array.isArray(assessments) && assessments.length > 0);
      } catch (error) {
        console.error("Error fetching assessment history:", error);
        setHasHistory(false);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      checkAssessmentHistory();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Link to="/" className="text-gray-500">
        not authenticated
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4 text-gray-500">
      {!loading && hasHistory && (
        <Link
          to="/assessment/history"
          title="Assessment History"
          className="hover:text-pink-600 text-sm font-medium"
        >
          <List className="h-5 w-5" />
        </Link>
      )}
      <Link
        to="/account/profile"
        title="Profile"
        className="hover:text-pink-600"
      >
        <User className="h-5 w-5" />
      </Link>
    </div>
  );
};

export default UserIcon;
