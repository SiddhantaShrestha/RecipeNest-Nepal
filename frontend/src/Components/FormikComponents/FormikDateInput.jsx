import { Field } from "formik";
import React from "react";

const FormikDateInput = ({ name, label, required, placeholder, ...props }) => {
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

      {/* Date Field */}
      <Field name={name}>
        {({ field, meta }) => (
          <div className="relative">
            <input
              {...field}
              {...props}
              id={name}
              type="date"
              placeholder={placeholder}
              className="input-field"
            />
            {/* Error Icon and Message */}
            {meta.touched && meta.error && (
              <div className="absolute inset-y-0 right-2 flex items-center">
                <span className="text-red-500">!</span>
              </div>
            )}
          </div>
        )}
      </Field>
    </div>
  );
};

export default FormikDateInput;
