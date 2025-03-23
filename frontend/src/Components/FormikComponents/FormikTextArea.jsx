import { Field } from "formik";
import React from "react";

const FormikTextArea = ({ name, label, onChange, required, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-200"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Field name={name}>
        {({ field, form, meta }) => (
          <div className="relative">
            <textarea
              {...field}
              {...props}
              id={name}
              value={meta.value}
              onChange={onChange ? onChange : field.onChange}
              className={`w-full px-4 py-3 rounded-lg bg-gray-700 border text-white shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 focus:outline-none transition-all duration-200 resize-y ${
                meta.touched && meta.error
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
            ></textarea>

            {meta.touched && meta.error && (
              <div className="mt-1 text-red-500 text-sm">{meta.error}</div>
            )}
          </div>
        )}
      </Field>
    </div>
  );
};

export default FormikTextArea;
