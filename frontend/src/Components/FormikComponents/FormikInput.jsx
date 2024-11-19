import { Field } from "formik";
import React from "react";

const FormikInput = ({ name, label, type, onChange, required, ...props }) => {
  return (
    <div>
      <Field name={name}>
        {({ field, form, meta }) => {
          // meta={
          //   value:,
          //   error:,
          //   touched:
          // }

          return (
            <div>
              <label htmlFor={name}>
                {" "}
                {label}{" "}
                {required ? <span style={{ color: "red" }}>*</span> : null}
              </label>
              <input
                {...field}
                {...props}
                id={name}
                type={type}
                placeholder={label} // Use label as placeholder
                value={meta.value}
                onChange={onChange ? onChange : field.onChange}
                // onChange={field.onChange}
              ></input>
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

export default FormikInput;
