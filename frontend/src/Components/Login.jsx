// Login.jsx
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "./FormikComponents/FormikInput";
import "../CSS/auth.css";

const Login = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values) => {
    console.log("Login Values", values);
    // Perform login logic here
  };

  return (
    <div className="auth-container">
      <div className="form-section">
        <h2>Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <FormikInput name="email" label="Email" type="email" required />
              <FormikInput
                name="password"
                label="Password"
                type="password"
                required
              />
              <p className="forgot-password">Forgot Password?</p>
              <button type="submit">Login</button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="info-section">
        <h2>New Here?</h2>
        <p>Create a Free account.</p>
        <button onClick={() => (window.location.href = "/signup")}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
