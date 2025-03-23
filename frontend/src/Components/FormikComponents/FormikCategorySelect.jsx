import React from "react";
import { Field } from "formik";
import Select from "react-select";
import { categories } from "../../categories";

const FormikCategorySelect = ({
  name,
  selectedCategory,
  setFieldValue,
  required,
  className,
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

  // Custom styles for react-select to match dark theme
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#374151", // bg-gray-700
      borderColor: state.isFocused ? "#F59E0B" : "#4B5563", // amber-500 when focused, gray-600 default
      borderWidth: "1px",
      borderRadius: "0.5rem",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(245, 158, 11, 0.2)" : "none",
      padding: "0.25rem",
      "&:hover": {
        borderColor: "#F59E0B", // amber-500
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1F2937", // bg-gray-800
      borderRadius: "0.375rem",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      border: "1px solid #4B5563", // border-gray-600
      zIndex: 20,
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "#111827" : "#F9FAFB", // text-gray-900 or text-white
      backgroundColor: state.isSelected
        ? "#F59E0B" // amber-500 if selected
        : state.isFocused
        ? "#4B5563" // gray-600 if hovered/focused
        : "#1F2937", // bg-gray-800 default
      "&:hover": {
        backgroundColor: state.isSelected ? "#F59E0B" : "#4B5563", // amber-500 or gray-600
      },
      cursor: "pointer",
      padding: "0.625rem 1rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#F9FAFB", // text-white
    }),
    input: (provided) => ({
      ...provided,
      color: "#F9FAFB", // text-white
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF", // text-gray-400
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#9CA3AF", // text-gray-400
      "&:hover": {
        color: "#F59E0B", // amber-500
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#9CA3AF", // text-gray-400
      "&:hover": {
        color: "#EF4444", // text-red-500
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#4B5563", // bg-gray-600
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#F9FAFB", // text-white
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#D1D5DB", // text-gray-300
      "&:hover": {
        backgroundColor: "#EF4444", // bg-red-500
        color: "#F9FAFB", // text-white
      },
    }),
  };

  return (
    <div className={className}>
      <Field name={name}>
        {({ field, meta }) => (
          <div>
            <Select
              {...field}
              options={categoryOptions}
              value={categoryOptions.find(
                (option) => option.value === selectedCategory
              )}
              onChange={handleCategoryChange}
              styles={customStyles}
              placeholder="Select a category"
              isSearchable={true}
              className="react-select-container"
              classNamePrefix="react-select"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#F59E0B", // amber-500
                  primary25: "#4B5563", // gray-600
                  neutral0: "#374151", // gray-700
                  neutral20: "#4B5563", // gray-600
                  neutral30: "#6B7280", // gray-500
                  neutral40: "#9CA3AF", // gray-400
                  neutral50: "#9CA3AF", // gray-400
                  neutral80: "#F9FAFB", // text-white
                },
                borderRadius: 8,
              })}
            />
            {meta.touched && meta.error && (
              <div className="mt-2 text-red-500 text-sm font-medium">
                {meta.error}
              </div>
            )}
          </div>
        )}
      </Field>
    </div>
  );
};

export default FormikCategorySelect;
