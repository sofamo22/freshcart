import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { userContext } from "../../Context/userContext";
import { login } from "../../utils/api";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const { setuserLogin, setUserId } = useContext(userContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Form validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(8, "Password is too short - should be 8 chars minimum.")
      .required("Required"),
  });

  // Handle login submission
  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const response = await login(values);
      if (response.message === "success" && response.token) {
        console.log("Login successful:", response);
        setuserLogin(response.token);
        localStorage.setItem("userToken", response.token);
        const decoded = jwtDecode(response.token);
        setUserId(decoded.id);
        toast.success("Login successful!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        console.error("Unexpected response structure:", response);
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize formik
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <section className="bg-gray-50">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000, style: { marginTop: "5rem" } }}
      />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-3xl">
              Sign in to your account
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
              <div>
                {formik.touched.password && formik.errors.password && (
                  <div className="alert alert-error gap-2 py-3 mb-3">
                    <span>{formik.errors.password}</span>
                  </div>
                )}
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </div>
              <div className="flex items-center justify-center">
                <Link
                  to="/forget-password"
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="btn bg-light-green text-white hover:bg-dark-green w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-dots loading-lg"></span>
                ) : (
                  "Login"
                )}
              </button>
              <p className="text-sm font-light text-gray-500">
                Don’t have an account yet?{" "}
                <Link
                  className="link text-dark-green font-medium hover:underline"
                  to="/register"
                >
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
