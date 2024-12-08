import { Field } from "formik";
import React from "react";

const FormikTextArea = ({
  name,
  label,
  type,
  onChange,
  required,
  ...props
}) => {
  return (
    <div>
      <Field name={name}>
        {({ field, form, meta }) => {
          return (
            <div>
              <label htmlFor={name}>
                {" "}
                {label}{" "}
                {required ? <span style={{ color: "red" }}>*</span> : null}
              </label>
              <textarea
                {...field}
                {...props}
                id={name}
                type={type}
                value={meta.value}
                onChange={onChange ? onChange : field.onChange}
                className="w-full p-2 border rounded-lg" // Ensuring consistency in styling
              ></textarea>
              {meta.touched && meta.error ? (
                <div style={{ color: "red" }}>{meta.error}</div>
              ) : null}
            </div>
          );
        }}
      </Field>
    </div>
  );
};

export default FormikTextArea;
