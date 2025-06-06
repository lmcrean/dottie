import React, { ReactNode } from 'react';

interface EndpointTableProps {
  title: string;
  children: ReactNode;
}

/**
 * A reusable table component for displaying API endpoints
 */
export default function EndpointTable({ title, children }: EndpointTableProps) {
  return (
    <div className="my-8">
      <div className="rounded-t-lg bg-gray-800 p-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-700">
            <tr>
              <th className="w-1/3 p-4 text-left font-medium text-white">Endpoint</th>
              <th className="w-1/3 p-4 text-left font-medium text-white">Expected Output</th>
              <th className="w-1/3 p-4 text-left font-medium text-white">Actual Output</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
