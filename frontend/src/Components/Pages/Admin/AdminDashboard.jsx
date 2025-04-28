import { useState, useEffect } from "react";
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
import {
  User,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Package,
  ArrowUpRight,
  Clock,
  Activity,
  BarChart3,
  CreditCard,
  ShoppingCart,
  Download,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";

export const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  // Analytics state
  const [analytics, setAnalytics] = useState({
    salesChange: 0,
    customersChange: 0,
    ordersChange: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    growthRate: 0,
  });

  // Report generation state
  const [reportStatus, setReportStatus] = useState({
    generating: false,
    success: false,
    error: false,
  });

  // Report popup state
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportData, setReportData] = useState(null);

  const [state, setState] = useState({
    options: {
      chart: {
        type: "area",
        background: "transparent",
        foreColor: "#e2e2e2",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
          },
          autoSelected: "zoom",
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      tooltip: {
        theme: "dark",
        x: {
          format: "dd MMM yyyy",
        },
        y: {
          formatter: function (val) {
            return "$" + val.toFixed(2);
          },
        },
      },
      colors: ["#10b981"],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.3,
          gradientToColors: ["#10b981", "rgba(16, 185, 129, 0.1)"],
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.2,
          stops: [0, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      title: {
        text: "Revenue Trends",
        align: "left",
        style: {
          color: "#f3f4f6",
          fontSize: "18px",
          fontWeight: "600",
        },
      },
      grid: {
        borderColor: "rgba(107, 114, 128, 0.2)",
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
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10,
        },
      },
      markers: {
        size: 5,
        colors: ["#10b981"],
        strokeColors: "#1f1f23",
        strokeWidth: 2,
        hover: {
          size: 8,
        },
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            color: "#e2e2e2",
            fontSize: "12px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 600,
          },
        },
        labels: {
          style: {
            colors: "#e2e2e2",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        title: {
          text: "Revenue ($)",
          style: {
            color: "#e2e2e2",
            fontSize: "12px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 600,
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
    series: [{ name: "Revenue", data: [] }],
  });

  // Secondary chart for order statistics
  const [orderState, setOrderState] = useState({
    options: {
      chart: {
        type: "bar",
        background: "transparent",
        foreColor: "#e2e2e2",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: function (val) {
            return val + " orders";
          },
        },
      },
      colors: ["#8b5cf6", "#ec4899", "#3b82f6"],
      plotOptions: {
        bar: {
          columnWidth: "60%",
          borderRadius: 4,
          distributed: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      title: {
        text: "Orders by Status",
        align: "left",
        style: {
          color: "#f3f4f6",
          fontSize: "18px",
          fontWeight: "600",
        },
      },
      grid: {
        borderColor: "rgba(107, 114, 128, 0.2)",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        categories: ["Pending", "Processing", "Completed"],
        labels: {
          style: {
            colors: "#e2e2e2",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        title: {
          text: "Count",
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
      theme: {
        mode: "dark",
      },
    },
    series: [
      {
        name: "Orders",
        data: [25, 15, 40],
      },
    ],
  });

  useEffect(() => {
    const navContainer = document.getElementById("navigation-container");
    const dashboardContent = document.getElementById("dashboard-content");

    if (navContainer && dashboardContent) {
      const handleHover = () => {
        dashboardContent.style.marginLeft = "16rem"; // 64px (w-64) in rem
      };

      const handleLeave = () => {
        dashboardContent.style.marginLeft = "5rem"; // 20px (w-20) in rem
      };

      navContainer.addEventListener("mouseenter", handleHover);
      navContainer.addEventListener("mouseleave", handleLeave);

      return () => {
        navContainer.removeEventListener("mouseenter", handleHover);
        navContainer.removeEventListener("mouseleave", handleLeave);
      };
    }
  }, []);

  // Calculate analytics when data changes
  useEffect(() => {
    if (sales && customers && orders) {
      // In a real app, you would fetch previous period data from your API
      // For this example, we'll simulate previous month data (20% less than current)
      const previousSales = sales.totalSales / 1.2;
      const previousCustomers = customers.length / 1.15;
      const previousOrders = orders.totalOrders / 1.18;

      // Calculate percentage changes
      const calculateChange = (current, previous) => {
        if (!previous || previous === 0) return 0;
        return ((current - previous) / previous) * 100;
      };

      const salesChange = calculateChange(sales.totalSales, previousSales);
      const customersChange = calculateChange(
        customers.length,
        previousCustomers
      );
      const ordersChange = calculateChange(orders.totalOrders, previousOrders);

      // Calculate other metrics
      const conversionRate =
        customers.length > 0
          ? (orders.totalOrders / customers.length) * 100
          : 0;

      const avgOrderValue =
        orders.totalOrders > 0 ? sales.totalSales / orders.totalOrders : 0;

      // Simulate other metrics with slight variations
      const growthRate = 10 + Math.random() * 15; // 10% to 25%

      setAnalytics({
        salesChange: parseFloat(salesChange.toFixed(1)),
        customersChange: parseFloat(customersChange.toFixed(1)),
        ordersChange: parseFloat(ordersChange.toFixed(1)),
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
        growthRate: parseFloat(growthRate.toFixed(1)),
      });
    }
  }, [sales, customers, orders]);

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
          { name: "Revenue", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  // Reset success message after 3 seconds
  useEffect(() => {
    let timer;
    if (reportStatus.success) {
      timer = setTimeout(() => {
        setReportStatus((prev) => ({ ...prev, success: false }));
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [reportStatus.success]);

  // Function to generate the report
  const generateReport = async () => {
    setReportStatus({ generating: true, success: false, error: false });

    try {
      // Simulate API call/processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create report data
      const data = {
        title: "Sales Performance Report",
        generatedAt: new Date().toISOString(),
        period: "Monthly",
        totalSales: sales?.totalSales || 0,
        totalOrders: orders?.totalOrders || 0,
        totalCustomers: customers?.length || 0,
        salesByDate: salesDetail || [],
        orderStatuses: {
          pending: 25,
          processing: 15,
          completed: 40,
        },
        analytics: {
          ...analytics,
        },
      };

      // Set the report data for the popup
      setReportData(data);

      // Show the popup
      setShowReportPopup(true);

      // Set success state
      setReportStatus({ generating: false, success: true, error: false });
    } catch (error) {
      console.error("Error generating report:", error);
      setReportStatus({ generating: false, success: false, error: true });
    }
  };

  // Function to download the report
  const downloadReport = () => {
    if (!reportData) return;

    // Convert to JSON string
    const reportJson = JSON.stringify(reportData, null, 2);

    // Create and download the file
    const blob = new Blob([reportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to close the popup
  const closeReportPopup = () => {
    setShowReportPopup(false);
  };

  // Format date for display in the report popup
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* AdminMenu component is retained for mobile but hidden on desktop */}
      <div className="md:hidden">
        <AdminMenu />
      </div>
      <main
        className="flex-1 p-6 md:p-8 lg:p-10 ml-20 transition-all duration-300"
        id="dashboard-content"
      >
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-400">Welcome back, Admin</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="bg-gray-900 text-gray-400 flex items-center px-3 py-2 rounded-lg border border-gray-800">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <button
                onClick={generateReport}
                disabled={reportStatus.generating}
                className={`${
                  reportStatus.success
                    ? "bg-emerald-700"
                    : reportStatus.generating
                    ? "bg-emerald-800 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                } text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200`}
              >
                {reportStatus.generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span className="text-sm font-medium">Generating...</span>
                  </>
                ) : reportStatus.success ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Report Ready</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Generate Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sales Card */}
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800/50 transition-all duration-300 hover:shadow-emerald-900/10 hover:border-emerald-900/50 hover:translate-y-[-4px]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    Total Revenue
                  </p>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      `$${sales?.totalSales.toFixed(2)}`
                    )}
                  </h2>
                  <div className="flex items-center mt-2">
                    <div
                      className={`flex items-center ${
                        analytics.salesChange >= 0
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        {analytics.salesChange}%
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs ml-2">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-emerald-900/20 p-4">
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 w-3/4 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800/50 transition-all duration-300 hover:shadow-blue-900/10 hover:border-blue-900/50 hover:translate-y-[-4px]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    Total Customers
                  </p>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    {loading ? <Loader /> : customers?.length}
                  </h2>
                  <div className="flex items-center mt-2">
                    <div
                      className={`flex items-center ${
                        analytics.customersChange >= 0
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        {analytics.customersChange}%
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs ml-2">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-blue-900/20 p-4">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 w-1/2 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800/50 transition-all duration-300 hover:shadow-purple-900/10 hover:border-purple-900/50 hover:translate-y-[-4px]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    Total Orders
                  </p>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    {loadingTwo ? <Loader /> : orders?.totalOrders}
                  </h2>
                  <div className="flex items-center mt-2">
                    <div
                      className={`flex items-center ${
                        analytics.ordersChange >= 0
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        {analytics.ordersChange}%
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs ml-2">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-purple-900/20 p-4">
                  <Package className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 w-2/3 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Main Revenue Chart */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl shadow-lg border border-gray-800/50 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Revenue Overview
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Monthly revenue performance
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded text-xs">
                    Week
                  </button>
                  <button className="bg-emerald-600 text-white px-3 py-1 rounded text-xs">
                    Month
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded text-xs">
                    Year
                  </button>
                </div>
              </div>
              <Chart
                options={state.options}
                series={state.series}
                type="area"
                height={350}
                width="100%"
              />
            </div>
          </div>

          {/* Order Statistics */}
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800/50 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Order Statistics
                  </h2>
                  <p className="text-gray-400 text-sm">Orders by status</p>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <Clock className="w-5 h-5" />
                </button>
              </div>
              <Chart
                options={orderState.options}
                series={orderState.series}
                type="bar"
                height={300}
                width="100%"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800/50 flex items-center">
            <div className="rounded-full bg-emerald-900/20 p-3 mr-4">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Conversion Rate</p>
              <h3 className="text-xl font-bold text-white">
                {analytics.conversionRate}%
              </h3>
              <p className="text-emerald-500 text-xs flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {(analytics.conversionRate * 0.3).toFixed(1)}% increase
              </p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800/50 flex items-center">
            <div className="rounded-full bg-blue-900/20 p-3 mr-4">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Avg. Order Value</p>
              <h3 className="text-xl font-bold text-white">
                ${analytics.avgOrderValue}
              </h3>
              <p className="text-emerald-500 text-xs flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {(analytics.avgOrderValue * 0.05).toFixed(2)}% increase
              </p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800/50 flex items-center">
            <div className="rounded-full bg-amber-900/20 p-3 mr-4">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Growth Rate</p>
              <h3 className="text-xl font-bold text-white">
                +{analytics.growthRate}%
              </h3>
              <p className="text-emerald-500 text-xs flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {(analytics.growthRate * 0.1).toFixed(1)}% increase
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <button className="text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors duration-200">
              View All Orders
            </button>
          </div>
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800/50 overflow-hidden">
            <OrderList />
          </div>
        </div>

        {/* Report Popup */}
        {showReportPopup && reportData && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 max-w-4xl w-full max-h-[80vh] overflow-auto">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  Sales Performance Report
                </h2>
                <button
                  onClick={closeReportPopup}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Report Content */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Generated on</p>
                      <p className="text-white">
                        {formatDate(reportData.generatedAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Report Period</p>
                      <p className="text-white">{reportData.period}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Total Sales</p>
                      <p className="text-xl font-bold text-white">
                        ${reportData.totalSales.toFixed(2)}
                      </p>
                      <p className="text-xs mt-1">
                        <span
                          className={
                            reportData.analytics.salesChange >= 0
                              ? "text-emerald-500"
                              : "text-red-500"
                          }
                        >
                          {reportData.analytics.salesChange >= 0 ? "↑" : "↓"}
                          {Math.abs(reportData.analytics.salesChange)}%
                        </span>{" "}
                        vs last month
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                      <p className="text-xl font-bold text-white">
                        {reportData.totalOrders}
                      </p>
                      <p className="text-xs mt-1">
                        <span
                          className={
                            reportData.analytics.ordersChange >= 0
                              ? "text-emerald-500"
                              : "text-red-500"
                          }
                        >
                          {reportData.analytics.ordersChange >= 0 ? "↑" : "↓"}
                          {Math.abs(reportData.analytics.ordersChange)}%
                        </span>{" "}
                        vs last month
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">
                        Total Customers
                      </p>
                      <p className="text-xl font-bold text-white">
                        {reportData.totalCustomers}
                      </p>
                      <p className="text-xs mt-1">
                        <span
                          className={
                            reportData.analytics.customersChange >= 0
                              ? "text-emerald-500"
                              : "text-red-500"
                          }
                        >
                          {reportData.analytics.customersChange >= 0
                            ? "↑"
                            : "↓"}
                          {Math.abs(reportData.analytics.customersChange)}%
                        </span>{" "}
                        vs last month
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Order Status Distribution
                    </h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">Pending Orders</span>
                        <span className="text-white font-medium">
                          {reportData.orderStatuses.pending}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">Processing Orders</span>
                        <span className="text-white font-medium">
                          {reportData.orderStatuses.processing}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Completed Orders</span>
                        <span className="text-white font-medium">
                          {reportData.orderStatuses.completed}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Sales by Date
                    </h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-gray-300">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="py-2 px-4 text-left">Date</th>
                              <th className="py-2 px-4 text-right">Revenue</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.salesByDate &&
                            reportData.salesByDate.length > 0 ? (
                              reportData.salesByDate.map((item, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-gray-700/50"
                                >
                                  <td className="py-2 px-4">{item._id}</td>
                                  <td className="py-2 px-4 text-right">
                                    ${item.totalSales.toFixed(2)}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="2"
                                  className="py-4 text-center text-gray-500"
                                >
                                  No sales data available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary and Recommendations section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Summary & Recommendations
                  </h3>
                  <div className="bg-gray-800 rounded-lg p-4 text-gray-300">
                    <p className="mb-2">
                      The sales performance for this period shows a{" "}
                      {reportData.analytics.salesChange >= 0
                        ? "positive"
                        : "negative"}
                      trend with a {Math.abs(reportData.analytics.salesChange)}%{" "}
                      {reportData.analytics.salesChange >= 0
                        ? "increase"
                        : "decrease"}{" "}
                      compared to last month.
                    </p>
                    <p className="mb-2">
                      {reportData.analytics.customersChange >= 0
                        ? `Customer base has grown by ${reportData.analytics.customersChange}%, indicating effective acquisition strategies.`
                        : `Customer base has decreased by ${Math.abs(
                            reportData.analytics.customersChange
                          )}%, indicating potential retention issues.`}
                    </p>
                    <p>Recommended actions:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {reportData.analytics.customersChange < 0 && (
                        <li>
                          Investigate causes of customer churn and implement
                          retention strategies
                        </li>
                      )}
                      <li>
                        Focus on reducing the number of pending orders to
                        improve fulfillment rates
                      </li>
                      {reportData.analytics.customersChange >= 0 ? (
                        <li>
                          Consider implementing loyalty programs to capitalize
                          on customer growth
                        </li>
                      ) : (
                        <li>
                          Consider re-engagement campaigns for inactive
                          customers
                        </li>
                      )}
                      <li>
                        Analyze high-performing products for potential expansion
                        opportunities
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-800 flex items-center justify-end space-x-4">
                <button
                  onClick={closeReportPopup}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center transition-colors duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
