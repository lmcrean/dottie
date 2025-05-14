import { useEffect, useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assessmentApi, type Assessment } from '@/src/pages/assessment/api';
import { toast } from 'sonner';
import PageTransition from '../page-transitions';

export default function HistoryPage() {
  // #actual
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatValue = (value: string | undefined): string => {
    if (!value) return 'Not provided';

    if (value === 'not-sure') return 'Not sure';
    if (value === 'varies') return 'Varies';
    if (value === 'under-13') return 'Under 13';
    if (value === '8-plus') return '8+ days';

    return value
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Unknown date';

    try {
      // Handle numeric timestamp format (e.g., "1745679949668.0")
      if (/^\d+(\.\d+)?$/.test(dateString)) {
        const timestamp = parseFloat(dateString);
        const date = new Date(timestamp);
        if (isValid(date)) {
          return format(date, 'MMM d, yyyy');
        }
      }

      // Standard date string handling
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid date';
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.warn(error);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await assessmentApi.list();
        setAssessments(data);
        console.log('Fetched assessments:', data);
        setError(null);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        setError('Unable to load your assessments. Please try again later.');
        toast.error('Failed to load assessments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-pink-600"></div>
          <p className="mt-4 text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              Assessment History
            </h1>
            <Link
              to="/assessment/age-verification"
              className="inline-flex items-center rounded-lg bg-pink-600 px-4 py-2 text-white transition-colors hover:bg-pink-700 hover:text-white"
            >
              New Assessment
            </Link>
          </div>

          {error ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-red-500">⚠️</div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">{error}</h3>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex w-full items-center rounded-lg bg-pink-600 px-4 py-2 text-white transition-colors hover:bg-pink-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : assessments.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assessments yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start your first assessment to track your menstrual health.
              </p>
              <div className="mt-6">
                <Link
                  to="/assessment"
                  className="inline-flex items-center rounded-lg bg-pink-600 px-4 py-2 text-white transition-colors hover:bg-pink-700"
                >
                  Start Assessment
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.map((assessment) => {
                const data = assessment?.assessment_data;

                return (
                  <Link
                    key={assessment.id}
                    to={`/assessment/history/${assessment.id}`}
                    className="block rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-2 text-xs font-medium text-pink-800">
                            {formatValue(data?.pattern)}
                          </span>
                          <span className="text-sm text-gray-500">{formatDate(data?.date)}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>
                            <span className="text-gray-900">Age:</span> {formatValue(data?.age)}
                            {data?.age && data.age !== 'under-13' ? ' years' : ''}
                          </p>
                          <p>
                            <span className="text-gray-900">Cycle Length:</span>{' '}
                            {formatValue(data?.cycleLength)}
                            {data?.cycleLength &&
                            !['other', 'varies', 'not-sure'].includes(data.cycleLength)
                              ? ' days'
                              : ''}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
