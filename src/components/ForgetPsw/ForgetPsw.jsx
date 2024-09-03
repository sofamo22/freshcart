import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPsw() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [setApiError] = useState("");

  // Form validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  // Handle forget password submission
  const handleSubmit = async (values) => {
    setIsLoading(true);
    toast
        .promise(
            axios.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', {
              email: values.email,
            }),
            {
              loading: "Sending reset link...",
              success: (response) => {
                return response.data.message || "Reset link sent successfully!";
              },
              error: (error) => {
                setApiError(error.message);
                return error.response?.data?.message || "An error occurred.";
              },
            }
        )
        .then(() => {
          setTimeout(() => navigate("/verify"), 2000); // 2-second delay before navigation
        })
        .finally(() => {
          setIsLoading(false);
        });
  };

  // Initialize formik
  const formik = useFormik({
    initialValues: { email: "" },
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
                Forget Password
              </h1>
              <form
                  onSubmit={formik.handleSubmit}
                  className="space-y-4 md:space-y-6"
              >
                <div>
                  {formik.touched.email && formik.errors.email && (
                      <div className="alert alert-error gap-2 py-3 mb-3">
                        <span>{formik.errors.email}</span>
                      </div>
                  )}
                  <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@gmail.com"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.email}
                  />
                </div>
                <button
                    type="submit"
                    className="btn bg-light-green text-white hover:bg-dark-green w-full"
                    disabled={isLoading}
                >
                  {isLoading ? (
                      <span className="loading loading-dots loading-lg"></span>
                  ) : (
                      "Reset Password"
                  )}
                </button>
                <p className="text-sm font-light text-gray-500">
                  Remember your password?{" "}
                  <Link
                      className="link text-dark-green font-medium hover:underline"
                      to="/login"
                  >
                    Sign in here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
  );
}
