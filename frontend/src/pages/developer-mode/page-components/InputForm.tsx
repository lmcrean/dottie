import React, { useState } from 'react';

interface InputField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'json';
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

interface InputFormProps {
  fields: InputField[];
  onSubmit: (formData: Record<string, any>) => void;
  submitLabel?: string;
  isLoading?: boolean;
}

/**
 * Form component for handling inputs for API requests that require parameters
 */
export default function InputForm({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  isLoading = false
}: InputFormProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    // Initialize form values with default values
    const initialValues: Record<string, any> = {};
    fields.forEach((field) => {
      initialValues[field.name] = field.defaultValue || '';
    });
    return initialValues;
  });

  const [jsonErrors, setJsonErrors] = useState<Record<string, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear JSON error when editing
    if (jsonErrors[name]) {
      setJsonErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleJsonChange = (name: string, value: string) => {
    try {
      const parsedValue = value.trim() ? JSON.parse(value) : '';
      setFormValues((prev) => ({ ...prev, [name]: parsedValue }));
      setJsonErrors((prev) => ({ ...prev, [name]: false }));
    } catch (error) {
      setFormValues((prev) => ({ ...prev, [name]: value }));
      setJsonErrors((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if there are any JSON errors
    if (Object.values(jsonErrors).some(Boolean)) {
      return;
    }

    // Parse JSON fields before submitting
    const processedValues = { ...formValues };
    fields.forEach((field) => {
      if (field.type === 'json' && typeof processedValues[field.name] === 'string') {
        try {
          processedValues[field.name] = processedValues[field.name].trim()
            ? JSON.parse(processedValues[field.name])
            : {};
        } catch (error) {
          // Keep as string if invalid JSON
        }
      }
    });

    onSubmit(processedValues);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-300">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>

          {field.type === 'textarea' || field.type === 'json' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={
                typeof formValues[field.name] === 'object'
                  ? JSON.stringify(formValues[field.name], null, 2)
                  : formValues[field.name]
              }
              onChange={handleInputChange}
              onBlur={
                field.type === 'json'
                  ? (e) => handleJsonChange(field.name, e.target.value)
                  : undefined
              }
              placeholder={field.placeholder}
              required={field.required}
              rows={5}
              className={`w-full rounded-md border bg-gray-700 px-3 py-2 ${
                jsonErrors[field.name]
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              } text-white placeholder-gray-400 focus:outline-none focus:ring-2`}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formValues[field.name]}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {field.type === 'json' && jsonErrors[field.name] && (
            <p className="mt-1 text-sm text-red-500">Invalid JSON format</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isLoading || Object.values(jsonErrors).some(Boolean)}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </div>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
