import React from 'react';

export default function Input({ label, value, onChange, type = 'text', placeholder = '', required = false, error }) {
  return (
    <label className="flex flex-col text-gray-700 font-medium w-full">
      {label && <span>{label}:</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`rounded mt-2 p-3 border ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-sky-500 focus:outline-none`}
        aria-required={required}
        aria-invalid={!!error}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </label>
  );
} 