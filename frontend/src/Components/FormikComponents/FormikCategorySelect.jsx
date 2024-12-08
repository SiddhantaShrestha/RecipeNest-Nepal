import React from "react";
import { Field } from "formik";
import Select from "react-select"; // Make sure you have react-select installed
import { categories } from "../../categories"; // Import categories

const FormikCategorySelect = ({
  name,
  selectedCategory,
  setFieldValue,
  required,
}) => {
  // Map categories into options for react-select
  const categoryOptions = categories.map((category) => ({
    label: category,
    value: category,
  }));

  // Handle the category change
  const handleCategoryChange = (selectedOption) => {
    setFieldValue(name, selectedOption ? selectedOption.value : "");
  };

  return (
    <div className="mb-4">
      {/* Label */}
      <label className="block mb-2">
        Category {required && <span className="text-red-500">*</span>}
      </label>

      {/* Formik Field for Select */}
      <Field name={name}>
        {({ field, meta }) => (
          <div>
            <Select
              {...field} // Spread Formik's field props
              options={categoryOptions} // Options for the dropdown
              value={categoryOptions.find(
                (option) => option.value === selectedCategory
              )} // Value for the select dropdown
              onChange={handleCategoryChange} // Update Formik's state when a selection is made
              className="w-full" // Tailwind CSS class for full width
              placeholder="Select a category" // Placeholder text
              isSearchable={true} // Make the dropdown searchable
            />
            {/* Error message */}
            {meta.touched && meta.error && (
              <div className="mt-1 text-red-500 text-sm">{meta.error}</div>
            )}
          </div>
        )}
      </Field>
    </div>
  );
};

export default FormikCategorySelect;
