import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyCode() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(""); // Added state for API errors

  // Form validation schema
  const validationSchema = Yup.object().shape({
    resetCode: Yup.string()
        .required("Required")
        .matches(/^\d+$/, "Must be a numeric code") // Ensure the code is numeric
        .min(4, "Code must be at least 4 characters") // Minimum length
        .max(10, "Code must be at most 10 characters"), // Maximum length
  });

  // Handle verify code submission
  const handleSubmit = async (values) => {
    setIsLoading(true);
    setApiError(""); // Clear previous API errors
    toast
        .promise(
            axios.post('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', {
              resetCode: values.resetCode,
            }),
            {
              loading: "Verifying code...",
              success: (response) => {
                setTimeout(() => navigate("/reset-password"), 2000); // 2-second delay before navigation
                return "Code verified successfully!";
              },
              error: (error) => {
                setApiError("Invalid code. Please try again."); // Set API error
                return "Invalid code. Please try again.";
              },
            }
        )
        .finally(() => {
          setIsLoading(false);
        });
  };

  // Initialize formik
  const formik = useFormik({
    initialValues: { resetCode: "" },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
      <section className="bg-gray-50">
        <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 2000, style: { marginTop: "5rem" } }}
        />
        <div className="flex flex-col items-center justify-center px-6 py-7 mx-auto md:h-[90vh] lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-3xl">
                Verify Code
              </h1>
              <form
                  onSubmit={formik.handleSubmit}
                  className="space-y-4 md:space-y-6"
              >
                <div>
                  {formik.touched.resetCode && formik.errors.resetCode && (
                      <div className="alert alert-error gap-2 py-3 mb-3">
                        <span>{formik.errors.resetCode}</span>
                      </div>
                  )}
                  <label
                      htmlFor="resetCode"
                      className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Reset Code
                  </label>
                  <input
                      id="resetCode"
                      name="resetCode"
                      type="text"
                      placeholder="Enter your reset code"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.resetCode}
                  />
                  {apiError && ( // Display API error
                      <div className="text-red-600 text-sm mt-2">
                        {apiError}
                      </div>
                  )}
                </div>
                <button
                    type="submit"
                    className="btn bg-light-green text-white hover:bg-dark-green w-full"
                    disabled={isLoading}
                >
                  {isLoading ? (
                      <span className="loading loading-dots loading-lg"></span>
                  ) : (
                      "Verify Code"
                  )}
                </button>
                <p className="text-sm font-light text-gray-500">
                  Didn’t receive a code?{" "}
                  <a
                      className="link text-dark-green font-medium hover:underline"
                      href="/resend-code"
                  >
                    Resend code
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
  );
}
