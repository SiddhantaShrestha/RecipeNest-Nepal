import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaShoppingBag,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaSync,
  FaSearch,
} from "react-icons/fa";
import { useGetMyOrdersQuery } from "../../../redux/api/orderApiSlice";
import SubNavbar from "../../SubNavbar";
import { BASE_URL } from "../../../redux/constants";

const UserOrder = () => {
  const {
    data: orders = [],
    isLoading,
    error,
    refetch: refetchOrders,
  } = useGetMyOrdersQuery();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Filter orders based on search term and status
  useEffect(() => {
    if (orders.length > 0) {
      const filtered = orders.filter((order) => {
        // Search filter (ID or total)
        const matchesSearch =
          searchTerm === "" ||
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.totalPrice.toString().includes(searchTerm);

        // Status filter
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "paid" && order.isPaid) ||
          (statusFilter === "unpaid" && !order.isPaid) ||
          (statusFilter === "delivered" && order.isDelivered) ||
          (statusFilter === "undelivered" && !order.isDelivered);

        return matchesSearch && matchesStatus;
      });

      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  }, [orders, searchTerm, statusFilter]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <SubNavbar />

      <div className="min-h-screen bg-gray-900 text-gray-200">
        <div className="container mx-auto px-4 py-8">
          {/* Header section */}
          <h2 className="text-3xl mb-8 text-center font-bold text-emerald-400 border-b border-gray-700 pb-4">
            My Orders
          </h2>

          {/* Controls section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="text-sm text-gray-400">
              <span className="font-medium text-white text-lg mr-2">
                Order History
              </span>
              <span className="bg-emerald-900/50 text-emerald-300 px-2.5 py-1 rounded-full text-xs">
                {orders.length} orders
              </span>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 w-full md:w-auto"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="delivered">Delivered</option>
                <option value="undelivered">Undelivered</option>
              </select>
              <button
                onClick={refetchOrders}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center font-medium"
              >
                <FaSync className="mr-2" /> Refresh
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-200 p-4 rounded-lg text-center my-8">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p className="text-lg">
                {error?.data?.message ||
                  error?.data?.error ||
                  "An error occurred while fetching orders"}
              </p>
              <button
                onClick={refetchOrders}
                className="mt-3 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredOrders.length === 0 && (
            <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
              <svg
                className="mx-auto h-16 w-16 text-gray-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
              <p className="text-xl text-gray-300 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "No orders match your search criteria"
                  : "You haven't placed any orders yet"}
              </p>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Browse our products and find something you'll love."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link
                  to="/shop"
                  className="py-3 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-200 inline-flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    ></path>
                  </svg>
                  Start Shopping
                </Link>
              )}
            </div>
          )}

          {/* Orders List */}
          {!isLoading && !error && filteredOrders.length > 0 && (
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/70 text-gray-300">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        <div className="flex items-center">
                          <FaShoppingBag className="mr-2" /> Items
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2" /> Date
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Delivery
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-800/40 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
                              <img
                                src={`${BASE_URL}${order.orderItems[0].image}`}
                                alt={order.user}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            {order.orderItems.length > 1 && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                                +{order.orderItems.length - 1} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-mono text-gray-400 truncate max-w-[120px]">
                            {order._id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300 flex items-center">
                            <FaCalendarAlt
                              className="mr-2 text-gray-500"
                              size={12}
                            />
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-emerald-400">
                            Rs {order.totalPrice}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {order.isPaid ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-400">
                              <FaCheck className="mr-1" /> Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-900/50 text-red-400">
                              <FaTimes className="mr-1" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {order.isDelivered ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-400">
                              <FaCheck className="mr-1" /> Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
                              <FaTimes className="mr-1" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link to={`/order/${order._id}`}>
                            <button
                              className="py-1.5 px-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center"
                              title="View Details"
                            >
                              <FaEye className="mr-1.5" /> Details
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrder;
