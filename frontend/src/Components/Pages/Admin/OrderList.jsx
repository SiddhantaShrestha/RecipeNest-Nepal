import Message from "../../Message";
import Loader from "../../Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminMenu />

      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6">Orders</h2>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full">
              <thead className="bg-gray-800 text-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">ITEMS</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">USER</th>
                  <th className="px-4 py-3 text-left">DATE</th>
                  <th className="px-4 py-3 text-left">TOTAL</th>
                  <th className="px-4 py-3 text-left">PAID</th>
                  <th className="px-4 py-3 text-left">DELIVERED</th>
                  <th className="px-4 py-3 text-center">ACTIONS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="bg-gray-800 bg-opacity-40 hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={`http://localhost:8000${order.orderItems[0].image}`}
                        alt={order._id}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-300">
                      {order._id}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {order.user ? order.user.username : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {order.createdAt
                        ? order.createdAt.substring(0, 10)
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      Rs {order.totalPrice}
                    </td>
                    <td className="px-4 py-3">
                      {order.isPaid ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-600 text-green-100">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-600 text-red-100">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {order.isDelivered ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-600 text-green-100">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-600 text-red-100">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        to={`/order/${order._id}`}
                        className="px-3 py-1 text-sm rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
