import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { CartContext } from '../../Context/CartContext.jsx';
import { useNavigate, useParams } from 'react-router-dom';

const validationSchema = Yup.object({
    details: Yup.string().required('Details are required'),
    phone: Yup.string()
        .required('Phone is required')
        .matches(/^01[0125][0-9]{8}$/, 'Phone is invalid'),
    city: Yup.string().required('City is required'),
    paymentMethod: Yup.string().required('Payment method is required'),
});

export default function Checkout() {
    let { cashOnDelivery } = useContext(CartContext);
    let navigate = useNavigate();
    let { cartId } = useParams();

    const handlePayment = async (values) => {
        console.log(values);
        let url;
        if (values.paymentMethod === 'Online') {
            url = `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:5173`;
            let res = await cashOnDelivery(url, values);
            if (res.status === 'success') {
                window.location.href = res.session.url;
            } else {
                alert('Error in payment');
            }
        } else if (values.paymentMethod === 'COD') {
            url = `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`;
            await cashOnDelivery(url, values);
            navigate('/allorders');
        }
    };

    const myform = useFormik({
        initialValues: { details: '', phone: '', city: '', paymentMethod: '' },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handlePayment(values);
        },
    });

    return (
        <section className="bg-white">
            <div className="h-[70vh] flex justify-center items-center">
                <div className="py-8 px-4 mx-auto max-w-2xl ">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">Checkout</h2>
                    <form onSubmit={myform.handleSubmit}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="details" className="block mb-2 text-sm font-medium text-gray-900">Enter
                                    Details</label>
                                <input
                                    type="text"
                                    name="details"
                                    id="details"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-600 focus:border-emerald-600 block w-full p-2.5"
                                    placeholder="Type your details"
                                    onChange={myform.handleChange}
                                    onBlur={myform.handleBlur}
                                    value={myform.values.details}
                                />
                                {myform.touched.details && myform.errors.details ? (
                                    <div className="text-red-600 text-sm mt-1">{myform.errors.details}</div>
                                ) : null}
                            </div>
                            <div className="w-full">
                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">Enter
                                    Your Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-600 focus:border-emerald-600 block w-full p-2.5"
                                    placeholder="Type your phone number"
                                    onChange={myform.handleChange}
                                    onBlur={myform.handleBlur}
                                    value={myform.values.phone}
                                />
                                {myform.touched.phone && myform.errors.phone ? (
                                    <div className="text-red-600 text-sm mt-1">{myform.errors.phone}</div>
                                ) : null}
                            </div>
                            <div className="w-full">
                                <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900">Enter
                                    Your City</label>
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-600 focus:border-emerald-600 block w-full p-2.5"
                                    placeholder="Type your city"
                                    onChange={myform.handleChange}
                                    onBlur={myform.handleBlur}
                                    value={myform.values.city}
                                />
                                {myform.touched.city && myform.errors.city ? (
                                    <div className="text-red-600 text-sm mt-1">{myform.errors.city}</div>
                                ) : null}
                            </div>
                            <div className="w-full">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Payment Method</label>
                                <div className="flex space-x-6">
                                    <div className="flex items-center mb-4">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            id="cod"
                                            value="COD"
                                            onChange={myform.handleChange}
                                            onBlur={myform.handleBlur}
                                            checked={myform.values.paymentMethod === 'COD'}
                                            className="radio radio-primary"
                                        />
                                        <label htmlFor="cod" className="ml-2 text-sm font-medium text-gray-900">Cash on
                                            Delivery</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            id="online"
                                            value="Online"
                                            onChange={myform.handleChange}
                                            onBlur={myform.handleBlur}
                                            checked={myform.values.paymentMethod === 'Online'}
                                            className="radio radio-primary"
                                        />
                                        <label htmlFor="online" className="ml-2 text-sm font-medium text-gray-900">Online
                                            Payment</label>
                                    </div>
                                </div>
                                {myform.touched.paymentMethod && myform.errors.paymentMethod ? (
                                    <div className="text-red-600 text-sm mt-1">{myform.errors.paymentMethod}</div>
                                ) : null}
                            </div>
                        </div>
                        <motion.button
                            type="submit"
                            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-emerald-700 rounded-lg focus:ring-4 focus:ring-emerald-200 hover:bg-emerald-800"
                            disabled={myform.isSubmitting}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            Pay Now
                        </motion.button>
                    </form>
                </div>
            </div>
        </section>
    );
}