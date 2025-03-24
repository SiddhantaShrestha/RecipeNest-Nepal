import React from "react";

const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-between items-center w-full max-w-3xl mb-4 px-4">
        <div
          className={`flex flex-col items-center relative ${
            step1 ? "text-amber-500" : "text-gray-500"
          }`}
        >
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
              step1
                ? "border-amber-500 bg-amber-500 bg-opacity-20"
                : "border-gray-600 bg-gray-700"
            }`}
          >
            {step1 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <span className="text-sm">1</span>
            )}
          </div>
          <span className="mt-2 text-sm font-medium">Login</span>
        </div>

        <div
          className={`h-0.5 flex-1 mx-2 ${
            step1 ? "bg-amber-500" : "bg-gray-600"
          }`}
        ></div>

        <div
          className={`flex flex-col items-center relative ${
            step2 ? "text-amber-500" : step1 ? "text-gray-300" : "text-gray-500"
          }`}
        >
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
              step2
                ? "border-amber-500 bg-amber-500 bg-opacity-20"
                : step1
                ? "border-gray-600 bg-gray-700"
                : "border-gray-600 bg-gray-700"
            }`}
          >
            {step2 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <span className="text-sm">2</span>
            )}
          </div>
          <span className="mt-2 text-sm font-medium">Shipping</span>
        </div>

        <div
          className={`h-0.5 flex-1 mx-2 ${
            step1 && step2 ? "bg-amber-500" : "bg-gray-600"
          }`}
        ></div>

        <div
          className={`flex flex-col items-center relative ${
            step3
              ? "text-amber-500"
              : step1 && step2
              ? "text-gray-300"
              : "text-gray-500"
          }`}
        >
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
              step3
                ? "border-amber-500 bg-amber-500 bg-opacity-20"
                : step1 && step2
                ? "border-gray-600 bg-gray-700"
                : "border-gray-600 bg-gray-700"
            }`}
          >
            {step3 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <span className="text-sm">3</span>
            )}
          </div>
          <span className="mt-2 text-sm font-medium">Summary</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
