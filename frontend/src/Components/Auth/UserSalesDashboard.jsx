import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {
  useGetUserProductSalesQuery,
  useGetUserSalesMetricsQuery,
} from "../../redux/api/userApiSlice";
import Loader from "../Loader";
import {
  User,
  ShoppingBag,
  DollarSign,
  Package,
  BarChart2,
} from "lucide-react";

export const UserSalesDashboard = () => {
  const { data: salesData, isLoading: isLoadingSales } =
    useGetUserProductSalesQuery();
  const { data: metricsData, isLoading: isLoadingMetrics } =
    useGetUserSalesMetricsQuery();

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
      colors: ["#10b981"],
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
        text: "My Sales Trend",
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
        colors: ["#10b981"],
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
          text: "Sales (Rs)",
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

    productChartOptions: {
      chart: {
        type: "bar",
        background: "#1f1f23",
        foreColor: "#e2e2e2",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#8b5cf6"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      title: {
        text: "Sales by Product",
        align: "left",
        style: {
          color: "#f3f4f6",
          fontSize: "18px",
          fontWeight: "600",
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#e2e2e2",
          },
        },
      },
      yaxis: {
        title: {
          text: "Revenue (Rs)",
          style: {
            color: "#e2e2e2",
          },
        },
        labels: {
          style: {
            colors: "#e2e2e2",
          },
          formatter: (value) => `$${value}`,
        },
      },
      fill: {
        opacity: 1,
      },
      theme: {
        mode: "dark",
      },
    },
    productSeries: [{ name: "Revenue", data: [] }],
  });

  useEffect(() => {
    if (salesData && salesData.salesByDate) {
      // Format data for line chart
      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: salesData.salesByDate.map((item) => item.date),
          },
        },
        series: [
          {
            name: "Sales",
            data: salesData.salesByDate.map((item) => item.total),
          },
        ],

        productChartOptions: {
          ...prevState.productChartOptions,
          xaxis: {
            ...prevState.productChartOptions.xaxis,
            categories: salesData.salesByProduct.map((product) => product.name),
          },
        },
        productSeries: [
          {
            name: "Revenue",
            data: salesData.salesByProduct.map((product) => product.revenue),
          },
        ],
      }));
    }
  }, [salesData]);

  return (
    <div className="flex min-h-screen bg-[#0f0f10]">
      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            My Sales Dashboard
          </h1>
          <p className="text-gray-400">
            Overview of your product sales performance
          </p>
        </div>

        {isLoadingSales || isLoadingMetrics ? (
          <div className="w-full flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Sales Card */}
              <div className="bg-[#1f1f23] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-green-500/10 hover:translate-y-[-4px]">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-green-500/20 p-3 mr-4">
                      <DollarSign className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Sales</p>
                      <h2 className="text-2xl font-bold text-white">
                        Rs{salesData?.totalSales.toFixed(2) || "0.00"}
                      </h2>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-green-500 to-teal-500 w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Products Card */}
              <div className="bg-[#1f1f23] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-green-500/10 hover:translate-y-[-4px]">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-purple-500/20 p-3 mr-4">
                      <Package className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Products</p>
                      <h2 className="text-2xl font-bold text-white">
                        {metricsData?.totalProducts || 0}
                      </h2>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500 w-1/2 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Units Sold Card */}
              <div className="bg-[#1f1f23] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-green-500/10 hover:translate-y-[-4px]">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-blue-500/20 p-3 mr-4">
                      <ShoppingBag className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Units Sold</p>
                      <h2 className="text-2xl font-bold text-white">
                        {metricsData?.totalUnitsSold || 0}
                      </h2>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 w-2/3 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Average Order Value */}
              <div className="bg-[#1f1f23] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-green-500/10 hover:translate-y-[-4px]">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-amber-500/20 p-3 mr-4">
                      <BarChart2 className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Avg. Order Value</p>
                      <h2 className="text-2xl font-bold text-white">
                        Rs{metricsData?.averageOrderValue.toFixed(2) || "0.00"}
                      </h2>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 w-1/2 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Product Card (if exists) */}
            {metricsData?.topProduct && (
              <div className="mt-8 bg-[#1f1f23] rounded-xl overflow-hidden shadow-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Top Performing Product
                </h2>
                <div className="flex items-center">
                  <div className="rounded-full bg-green-500/20 p-4 mr-6">
                    <Package className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {metricsData.topProduct.name}
                    </h3>
                    <div className="flex flex-wrap gap-6 mt-2">
                      <div>
                        <p className="text-gray-400 text-sm">Revenue</p>
                        <p className="text-white font-bold">
                          Rs{metricsData.topProduct.revenue.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Units Sold</p>
                        <p className="text-white font-bold">
                          {metricsData.topProduct.unitsSold}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Sales Trend Chart */}
              <div className="bg-[#1f1f23] rounded-xl shadow-lg p-6">
                <Chart
                  options={state.options}
                  series={state.series}
                  type="area"
                  height={350}
                  width="100%"
                />
              </div>

              {/* Product Sales Chart */}
              <div className="bg-[#1f1f23] rounded-xl shadow-lg p-6">
                <Chart
                  options={state.productChartOptions}
                  series={state.productSeries}
                  type="bar"
                  height={350}
                  width="100%"
                />
              </div>
            </div>

            {/* Product Sales Table */}
            <div className="mt-8 bg-[#1f1f23] rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Product Sales Details
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-[#2a2a30] text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Product Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Units Sold
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Revenue
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Avg. Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData?.salesByProduct &&
                    salesData.salesByProduct.length > 0 ? (
                      salesData.salesByProduct.map((product, index) => (
                        <tr
                          key={product.productId}
                          className={`border-b border-gray-700 ${
                            index % 2 === 0 ? "bg-[#1f1f23]" : "bg-[#18181c]"
                          } hover:bg-[#2a2a30]`}
                        >
                          <td className="px-6 py-4 font-medium text-white">
                            {product.name}
                          </td>
                          <td className="px-6 py-4">{product.unitsSold}</td>
                          <td className="px-6 py-4">
                            ${product.revenue.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            {(product.revenue / product.unitsSold).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-gray-700 bg-[#1f1f23]">
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-gray-400"
                        >
                          No product sales data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default UserSalesDashboard;
