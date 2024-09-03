import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(""); // Added state for API errors

    // Form validation schema
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email")
            .required("Required"),
        newPassword: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Required"),
    });

    // Handle reset password submission
    const handleSubmit = async (values) => {
        setIsLoading(true);
        setApiError(""); // Clear previous API errors
        toast
            .promise(
                axios.put("https://ecommerce.routemisr.com/api/v1/auth/resetPassword", {
                    email: values.email,
                    newPassword: values.newPassword,
                }),
                {
                    loading: "Resetting password...",
                    success: (response) => {
                        setTimeout(() => navigate("/login"), 2000); // 2-second delay before navigation
                        return "Password reset successfully!";
                    },
                    error: (error) => {
                        setApiError("An error occurred. Please try again."); // Set API error
                        return "An error occurred. Please try again.";
                    },
                }
            )
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Initialize formik
    const formik = useFormik({
        initialValues: { email: "", newPassword: "" },
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
                            Reset Password
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
                                    placeholder="Enter your email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                />
                            </div>

                            <div>
                                {formik.touched.newPassword && formik.errors.newPassword && (
                                    <div className="alert alert-error gap-2 py-3 mb-3">
                                        <span>{formik.errors.newPassword}</span>
                                    </div>
                                )}
                                <label
                                    htmlFor="newPassword"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    placeholder="Enter your new password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.newPassword}
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
                                    "Reset Password"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
