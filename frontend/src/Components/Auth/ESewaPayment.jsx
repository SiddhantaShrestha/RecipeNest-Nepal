import React, { useState } from "react";
import axios from "axios";

const EsewaPayment = ({ amount = "100" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Generate a unique transaction ID
      const transaction_uuid = `ORD-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

      const response = await axios.post("http://localhost:5000/api/esewa/pay", {
        amount: amount,
        transaction_uuid: transaction_uuid,
      });

      if (response.data.formData) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        for (const key in response.data.formData) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = response.data.formData[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setError("Failed to initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className="ml-20 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Pay with eSewa"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default EsewaPayment;
