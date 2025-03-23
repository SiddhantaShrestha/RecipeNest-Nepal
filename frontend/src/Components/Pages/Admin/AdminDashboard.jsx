import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../../redux/api/userApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../Loader";
import { User, ShoppingBag, DollarSign } from "lucide-react";

export const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        background: "#1f1f23",
        foreColor: "#e2e2e2",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#ec4899"],
      dataLabels: {
        enabled: false,
        style: {
          colors: ["#f3f4f6"],
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: {
          color: "#f3f4f6",
          fontSize: "18px",
          fontWeight: "600",
        },
      },
      grid: {
        borderColor: "#333",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      markers: {
        size: 5,
        colors: ["#ec4899"],
        strokeColors: "#1f1f23",
        strokeWidth: 2,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            color: "#e2e2e2",
          },
        },
        labels: {
          style: {
            colors: "#e2e2e2",
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales ($)",
          style: {
            color: "#e2e2e2",
          },
        },
        min: 0,
        labels: {
          style: {
            colors: "#e2e2e2",
          },
          formatter: (value) => `$${value}`,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: {
          colors: "#e2e2e2",
        },
      },
      theme: {
        mode: "dark",
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="flex min-h-screen bg-[#0f0f10]">
      {/* The AdminMenu component is retained for mobile but hidden on desktop */}
      <div className="md:hidden">
        <AdminMenu />
      </div>

      {/* Main content with left margin to account for the sidebar */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 ml-[4%] md:ml-[4%] hover:ml-[15%] transition-all duration-300">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome to your admin overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sales Card */}
          <div className="bg-[#1f1f23] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-pink-500/10 hover:translate-y-[-4px]">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-pink-500/20 p-3 mr-4">
                  <DollarSign className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Sales</p>
                  <h2 className="text-2xl font-bold text-white">
                    {isLoading ? <Loader /> : `$${sales.totalSales.toFixed(2)}`}
                  </h2>
                </div>
              </div>
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-pink-500 to-purple-500 w-3/4 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="bg-[#1f1f23] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-pink-500/10 hover:translate-y-[-4px]">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-500/20 p-3 mr-4">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Customers</p>
                  <h2 className="text-2xl font-bold text-white">
                    {loading ? <Loader /> : customers?.length}
                  </h2>
                </div>
              </div>
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 w-1/2 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-[#1f1f23] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-pink-500/10 hover:translate-y-[-4px]">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-purple-500/20 p-3 mr-4">
                  <ShoppingBag className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <h2 className="text-2xl font-bold text-white">
                    {loadingTwo ? <Loader /> : orders?.totalOrders}
                  </h2>
                </div>
              </div>
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500 w-2/3 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-8 p-6 bg-[#1f1f23] rounded-xl shadow-lg">
          <Chart
            options={state.options}
            series={state.series}
            type="area"
            height={350}
            width="100%"
          />
        </div>

        {/* Recent Orders */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-6">Recent Orders</h2>
          <OrderList />
        </div>
      </main>
    </div>
  );
};
