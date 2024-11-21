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
          className="block mb-2 text-sm font-medium text-gray-700"
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
              className={`input-field ${
                meta.touched && meta.error
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {/* Exclamation Mark Icon */}
            {meta.touched && meta.error && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                <i className="fas fa-exclamation-circle text-xl"></i>
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
