import React from 'react';
import { Heart } from 'lucide-react';

interface Recommendation {
  title: string;
  description: string;
}

interface RecommendationsDisplayProps {
  recommendations: Recommendation[];
}

export const RecommendationsDisplay: React.FC<RecommendationsDisplayProps> = ({
  recommendations
}) => {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Heart className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">Recommendations</h2>
      </div>
      <div className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec: Recommendation, index: number) => (
            <div key={index} className="rounded-lg border bg-gray-50 p-4 dark:border-slate-800">
              <h3 className="text-xl font-medium text-pink-600">{rec.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{rec.description}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No recommendations available</p>
        )}
      </div>
    </div>
  );
};
