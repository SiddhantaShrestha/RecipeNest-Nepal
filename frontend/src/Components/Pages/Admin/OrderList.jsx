import { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaShoppingBag,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaSync,
} from "react-icons/fa";
import Loader from "../../Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import { BASE_URL } from "../../../redux/constants";

const OrderList = () => {
  const { data: orders = [], isLoading, error, refetch } = useGetOrdersQuery();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Filter orders based on search term and status
  useEffect(() => {
    if (orders.length > 0) {
      //  sort orders by date (most recent first)
      const sortedOrders = [...orders].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      //  apply filters
      const filtered = sortedOrders.filter((order) => {
        // Search filter (ID, user, or total)
        const matchesSearch =
          searchTerm === "" ||
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.user &&
            order.user.username
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
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
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <AdminMenu />

      <div className="container mx-auto px-4 py-8">
        {/* Controls section */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-400">
            <span className="font-medium text-white text-lg mr-2">
              All Orders
            </span>
            <span className="bg-purple-600/20 text-purple-400 px-2.5 py-1 rounded-full text-xs">
              {orders.length} total
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center font-medium"
          >
            <FaSync className="mr-2" /> Refresh
          </button>
        </div>

        {/* Search and filter section */}
        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Search by ID, user or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <select
                className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="paid">Paid Only</option>
                <option value="unpaid">Unpaid Only</option>
                <option value="delivered">Delivered Only</option>
                <option value="undelivered">Undelivered Only</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 border border-gray-700"
              >
                Clear Filters
              </button>
              <div className="bg-gray-800 text-gray-300 px-4 py-2.5 rounded-lg border border-gray-700">
                {filteredOrders.length} results
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 bg-gray-900 rounded-xl border border-gray-800">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 p-6 rounded-xl text-red-400 flex items-start">
            <FaTimes className="mr-3 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-300 mb-1">
                Error Loading Orders
              </p>
              <p>{error?.data?.message || error.error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-800">
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center">
                <FaShoppingBag
                  className="mx-auto text-gray-600 mb-4"
                  size={48}
                />
                <h3 className="text-xl font-medium text-gray-400 mb-2">
                  No Orders Found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "There are no orders in the system yet"}
                </p>
              </div>
            ) : (
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
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        User
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
                        Paid
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Delivered
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
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-700 bg-gray-800">
                              <img
                                src={`${BASE_URL}${order.orderItems[0].image}`}
                                alt={order._id}
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
                          <div className="text-sm font-medium text-white">
                            {order.user ? order.user.username : "N/A"}
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
                          <div className="text-sm font-medium text-purple-400">
                            Rs {order.totalPrice}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {order.isPaid ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/50">
                              <FaCheck className="mr-1" /> Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800/50">
                              <FaTimes className="mr-1" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {order.isDelivered ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/50">
                              <FaCheck className="mr-1" /> Delivered
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
                              <FaTimes className="mr-1" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            to={`/order/${order._id}`}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                          >
                            <FaEye className="mr-1.5" /> Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
