import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from "../../Context/CartContext.jsx";
import { userContext } from "../../Context/userContext.jsx";
import { Truck, CreditCard, Calendar } from 'lucide-react';
import 'daisyui/dist/full.css';

export default function Orders() {
  const { getOrders } = useContext(CartContext);
  const { userId } = useContext(userContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      let data = await getOrders(userId);
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, [getOrders, userId]);

  return (
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-green-600 mb-6">My Orders</h1>

        {loading ? (
            <div className="flex justify-center items-center h-[80vh]">
              <span className="loading loading-infinity loading-lg"></span>
            </div>
        ) : (
            orders.length === 0 ? (
                <div className="flex justify-center items-center h-[80vh]">
                  <p className="text-xl text-gray-600">You have no orders.</p>
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="mb-4">
                      <div className="bg-green-100 p-4 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                          <span
                              className={`badge ${order.isPaid ? 'badge-success' : 'badge-error'}`}
                          >
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="flex items-center text-lg">
                              <Calendar className="w-5 h-5 mr-2" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="flex items-center text-lg">
                              <CreditCard className="w-5 h-5 mr-2" />
                              {order.paymentMethodType}
                            </p>
                          </div>
                          <div>
                            <p className="flex items-center text-lg">
                              <Truck className="w-5 h-5 mr-2" />
                              {order.isDelivered ? 'Delivered' : 'Pending'}
                            </p>
                            <p className="text-lg font-semibold">Total: ${order.totalOrderPrice}</p>
                          </div>
                        </div>

                        <div tabIndex={0} className="collapse collapse-arrow">
                          <input type="checkbox" />
                          <div className="collapse-title text-lg font-medium">
                            Order Details
                          </div>
                          <div className="collapse-content">
                            <ul className="space-y-3">
                              {order.cartItems.map((item) => (
                                  <li key={item._id} className="flex items-center">
                                    <img
                                        src={item.product.imageCover}
                                        alt={item.product.title}
                                        className="w-12 h-12 rounded-lg mr-4"
                                    />
                                    <div>
                                      <p className="font-semibold">{item.product.title}</p>
                                      <p className="text-gray-600">Quantity: {item.count} | Price: ${item.price}</p>
                                    </div>
                                  </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                ))
            )
        )}
      </div>
  );
}