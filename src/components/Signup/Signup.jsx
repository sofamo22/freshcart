import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../utils/api";
import * as Yup from "yup";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { userContext } from "../../Context/userContext";

const MySwal = withReactContent(Swal);

export default function Signup() {
  // Context
  let { userLogin, setuserLogin } = useContext(userContext);

  const [ApiError, setApiError] = useState("");
  const [IsLoading, setIsLoading] = useState(false);

  // Form validation function (Custom Validation Without using Yup)
  // function formValidation(values) {
  //   let errors = {};
  //   if (!values.name) {
  //     errors.name = "Name is required";
  //   } else if (!/^[A-Z][a-zA-Z\s]{2,}$/.test(values.name)) {
  //     errors.name =
  //       "Name must start with a capital letter and be at least 3 characters";
  //   }
  //   if (!values.email) {
  //     errors.email = "Email is required";
  //   } else if (!/\S+@\S+\.\S+/.test(values.email)) {
  //     errors.email = "Email is invalid";
  //   }
  //   if (!values.phone) {
  //     errors.phone = "Phone is required";
  //   } else if (!/^01[0125][0-9]{8}$/.test(values.phone)) {
  //     errors.phone = "Phone is invalid";
  //   }
  //   if (!values.password) {
  //     errors.password = "Password is required";
  //   } else if (values.password.length < 8) {
  //     errors.password = "Password must be at least 8 characters";
  //   }
  //   if (!values.rePassword) {
  //     errors.rePassword = "Confirm password is required";
  //   } else if (values.rePassword !== values.password) {
  //     errors.rePassword = "Passwords do not match";
  //   }
  //   return errors;
  // }

  let navigate = useNavigate();
  let Validation = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .matches(
        /^[A-Z][a-zA-Z\s]{2,}$/,
        "Name must start with a capital letter and be at least 3 characters"
      ),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^01[0125][0-9]{8}$/, "Phone is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    rePassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords do not match"),
  });

  async function handleRegister(values) {
    setIsLoading(true);
    try {
      let response = await signup(values);
      console.log("Signup API response:", response);
      if (response.message == "success") {
        localStorage.setItem("userToken", response.token);
        setuserLogin(response.token);
        navigate("/");
      }
    } catch (error) {
      setApiError(error.response.data.message);
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    },
    // validate: formValidation,
    validationSchema: Validation,
    onSubmit: handleRegister,
  });

  return (
    <>
      <section className="bg-gray-50 ">
        <div className="flex flex-col items-center justify-center px-6 py-16 mx-auto md:pt-24">
          <div className="w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0  ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-3xl ">
                Create an account
              </h1>
              <form
                onSubmit={formik.handleSubmit}
                className="space-y-4 md:space-y-6 form-control"
              >
                <div>
                  {formik.errors.name && formik.touched.name ? (
                    <div
                      role="alert"
                      className="alert alert-error gap-2 py-3 mb-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{formik.errors.name}</span>
                    </div>
                  ) : null}
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Your Name
                  </label>
                  <input
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    name="name"
                    type="text"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 "
                    placeholder="seif mohammed"
                  />
                </div>
                <div>
                  {formik.errors.email && formik.touched.email ? (
                    <div
                      role="alert"
                      className="alert alert-error gap-2 py-3 mb-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{formik.errors.email}</span>
                    </div>
                  ) : null}
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Your Email
                  </label>
                  <input
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 "
                    placeholder="example@gmail.com"
                  />
                </div>
                <div>
                  {formik.errors.phone && formik.touched.phone ? (
                    <div
                      role="alert"
                      className="alert alert-error gap-2 py-3 mb-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{formik.errors.phone}</span>
                    </div>
                  ) : null}
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Your Phone
                  </label>
                  <input
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    type="tel"
                    name="phone"
                    id="phone"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 "
                    placeholder="01234567891"
                  />
                </div>
                <div>
                  {formik.errors.password && formik.touched.password ? (
                    <div
                      role="alert"
                      className="alert alert-error gap-2 py-3 mb-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{formik.errors.password}</span>
                    </div>
                  ) : null}
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Password
                  </label>
                  <input
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 "
                  />
                </div>
                <div>
                  {formik.errors.rePassword && formik.touched.rePassword ? (
                    <div
                      role="alert"
                      className="alert alert-error gap-2 py-3 mb-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{formik.errors.rePassword}</span>
                    </div>
                  ) : null}
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Confirm password
                  </label>
                  <input
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.rePassword}
                    type="password"
                    name="rePassword"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 "
                  />
                </div>
                <button
                  type="submit"
                  className="btn bg-light-green text-white hover:bg-dark-green "
                  disabled={IsLoading}
                >
                  {IsLoading ? (
                    <span className="loading loading-dots loading-lg"></span>
                  ) : (
                    "Create an account"
                  )}
                </button>
                <p className="text-sm font-light text-gray-500 ">
                  Already have an account?{" "}
                  <Link
                    className="link text-dark-green font-medium hover:underline "
                    to="/login"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
