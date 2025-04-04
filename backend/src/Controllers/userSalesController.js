import { Order } from "../Schema/model.js";
import Product from "../Schema/productSchema.js";

// Get user's product sales data
const getUserProductSales = async (req, res) => {
  try {
    // Find all products submitted by this user
    const userProducts = await Product.find({ submittedBy: req.user._id });

    if (!userProducts || userProducts.length === 0) {
      return res.json({ totalSales: 0, salesByProduct: [], salesByDate: [] });
    }

    // Get IDs of all user products
    const userProductIds = userProducts.map((product) => product._id);

    // Find completed orders containing these products
    const orders = await Order.find({
      "orderItems.product": { $in: userProductIds },
      isPaid: true,
    });

    // Calculate sales data
    let totalSales = 0;
    const salesByProduct = {};
    const salesByDate = {};

    // Process each order
    orders.forEach((order) => {
      const orderDate = order.paidAt
        ? new Date(order.paidAt).toISOString().split("T")[0]
        : "unknown";

      // Process each item in the order
      order.orderItems.forEach((item) => {
        // Check if this item is one of the user's products
        const productIdStr = item.product.toString();
        if (userProductIds.some((id) => id.toString() === productIdStr)) {
          const itemTotal = item.price * item.qty;

          // Add to total sales
          totalSales += itemTotal;

          // Add to sales by product
          if (!salesByProduct[productIdStr]) {
            salesByProduct[productIdStr] = {
              productId: productIdStr,
              name: item.name,
              unitsSold: 0,
              revenue: 0,
            };
          }
          salesByProduct[productIdStr].unitsSold += item.qty;
          salesByProduct[productIdStr].revenue += itemTotal;

          // Add to sales by date
          if (!salesByDate[orderDate]) {
            salesByDate[orderDate] = 0;
          }
          salesByDate[orderDate] += itemTotal;
        }
      });
    });

    // Convert salesByProduct object to array for easier frontend consumption
    const salesByProductArray = Object.values(salesByProduct);

    // Convert salesByDate object to array format for chart consumption
    const salesByDateArray = Object.entries(salesByDate)
      .map(([date, total]) => ({
        date,
        total,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      totalSales,
      salesByProduct: salesByProductArray,
      salesByDate: salesByDateArray,
    });
  } catch (error) {
    console.error("Error getting user sales data:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get sales performance metrics
const getUserSalesMetrics = async (req, res) => {
  try {
    // Find all products submitted by this user
    const userProducts = await Product.find({ submittedBy: req.user._id });

    if (!userProducts || userProducts.length === 0) {
      return res.json({
        totalProducts: 0,
        totalUnitsSold: 0,
        averageOrderValue: 0,
        topProduct: null,
      });
    }

    // Get IDs of all user products
    const userProductIds = userProducts.map((product) => product._id);

    // Find orders containing these products
    const orders = await Order.find({
      "orderItems.product": { $in: userProductIds },
      isPaid: true,
    });

    // Calculate metrics
    let totalUnitsSold = 0;
    let totalRevenue = 0;
    let totalOrders = new Set();
    const productSales = {};

    // Process each order
    orders.forEach((order) => {
      let hasUserProduct = false;

      // Process each item in the order
      order.orderItems.forEach((item) => {
        // Check if this item is one of the user's products
        const productIdStr = item.product.toString();
        if (userProductIds.some((id) => id.toString() === productIdStr)) {
          const itemTotal = item.price * item.qty;
          totalUnitsSold += item.qty;
          totalRevenue += itemTotal;
          hasUserProduct = true;

          // Track sales per product
          if (!productSales[productIdStr]) {
            productSales[productIdStr] = {
              productId: productIdStr,
              name: item.name,
              unitsSold: 0,
              revenue: 0,
            };
          }
          productSales[productIdStr].unitsSold += item.qty;
          productSales[productIdStr].revenue += itemTotal;
        }
      });

      // Count unique orders containing user products
      if (hasUserProduct) {
        totalOrders.add(order._id.toString());
      }
    });

    // Find top product by revenue
    let topProduct = null;
    let maxRevenue = 0;

    Object.values(productSales).forEach((product) => {
      if (product.revenue > maxRevenue) {
        maxRevenue = product.revenue;
        topProduct = product;
      }
    });

    const averageOrderValue =
      totalOrders.size > 0 ? totalRevenue / totalOrders.size : 0;

    res.json({
      totalProducts: userProducts.length,
      totalUnitsSold,
      totalOrders: totalOrders.size,
      averageOrderValue,
      topProduct,
    });
  } catch (error) {
    console.error("Error getting user sales metrics:", error);
    res.status(500).json({ error: error.message });
  }
};

export { getUserProductSales, getUserSalesMetrics };
