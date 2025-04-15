import React from 'react';
import { Calendar } from 'lucide-react';

interface CycleInformationProps {
    age: string;
    cycleLength: string;
    periodDuration: string;
}

const CycleInformation = ({ age, cycleLength, periodDuration }: CycleInformationProps) => {
    return (
        <div className="bg-gray-50 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                    Cycle Information
                </h2>
            </div>
            <div className="space-y-4">
                {[
                    { label: 'Age', value: `${age} years` },
                    { label: 'Cycle Length', value: `${cycleLength} days` },
                    { label: 'Period Duration', value: `${periodDuration} days` },
                ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-100 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-700">{item.label}:</span>
                        <span className="text-sm text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CycleInformation;