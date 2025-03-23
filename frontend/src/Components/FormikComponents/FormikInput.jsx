import { Field } from "formik";
import React from "react";

const FormikInput = ({
  name,
  label,
  type = "text",
  required,
  placeholder,
  autocomplete,
  ...props
}) => {
  return (
    <div className="mb-4">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-200"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Field */}
      <Field name={name}>
        {({ field, meta }) => (
          <div className="relative">
            <input
              {...field}
              {...props}
              id={name}
              type={type}
              placeholder={placeholder}
              autoComplete={autocomplete || "off"}
              className={`w-full px-4 py-3 rounded-lg bg-gray-700 border text-white shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 focus:outline-none transition-all duration-200 ${
                meta.touched && meta.error
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
            />
            {/* Exclamation Mark Icon */}
            {meta.touched && meta.error && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
            {/* Error Message */}
            {meta.touched && meta.error && (
              <div className="mt-1 text-red-500 text-sm">{meta.error}</div>
            )}
          </div>
        )}
      </Field>
    </div>
  );
};

export default FormikInput;
