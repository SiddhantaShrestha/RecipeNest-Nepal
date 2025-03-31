import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { persistor } from "./redux/stores";
import store from "./redux/store.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { restoreAuth } from "./slices/authSlice";

import App from "./App";
import "./index.css";
import { PersistGate } from "redux-persist/lib/integration/react";
import Signup from "./Components/Auth/Signup.jsx";
import Login from "./Components/Auth/Login.jsx";
import VerifyEmail from "./Components/Auth/VerifyEmail.jsx";
import NotFound from "./Components/NotFound";
import HomePage from "./Components/HomePage.jsx";
import ResetPassword from "./Components/Auth/ResetPassword";
import ForgotPassword from "./Components/Auth/ForgotPassword.jsx";
import BlogSection from "./Components/Blog/BlogSection.jsx";
import CreateBlogPage from "./Components/Blog/CreateBlogPage.jsx";
import BlogDetailsPage from "./Components/Blog/BlogDetailsPage.jsx";
import UpdateBlogPage from "./Components/Blog/UpdateBlogPage.jsx";
import AddRecipePage from "./Components/Recipe/AddRecipePage.jsx";
import RecipeListPage from "./Components/Recipe/RecipeListPage.jsx";
import ViewRecipePage from "./Components/Recipe/ViewRecipePage.jsx";
import MyProfile from "./Components/Auth/MyProfile.jsx";
import ChangePassword from "./Components/Auth/ChangePassword.jsx";
import CheckDesign from "./Components/checkdesign.jsx";
import SavedRecipes from "./Components/SavedRecipes.jsx";
import MyRecipesPage from "./Components/Auth/MyRecipesPage.jsx";
import EditRecipe from "./Components/Recipe/EditRecipe.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import AdminRoutes from "./Components/Pages/Admin/AdminRoutes.jsx";
import UserList from "./Components/Pages/Admin/UserList.jsx";
import CategoryList from "./Components/Pages/Admin/CategoryList.jsx";
import ProductList from "./Components/Pages/Admin/ProductList.jsx";
import ProductUpdate from "./Components/Pages/Admin/ProductUpdate.jsx";

import Cart from "./Components/Pages/Cart.jsx";
import Shop from "./Components/Pages/Shop.jsx";
// import AdminProductUpdate from "./Components/Admin/ProductUpdate.jsx";
import AllProducts from "./Components/Pages/Admin/AllProducts.jsx";
import Home from "./Components/Pages/Home.jsx";
import Favorites from "./Components/Products/Favorites.jsx";
import ProductDetails from "./Components/Products/ProductDetails.jsx";
import EsewaPayment from "./Components/Auth/ESewaPayment.jsx";
import Shipping from "./Components/Pages/Orders/Shipping.jsx";
import PlaceOrder from "./Components/Pages/Orders/PlaceOrder.jsx";
import Order from "./Components/Pages/Orders/Order.jsx";
import AdminRecipeApproval from "./Components/Recipe/AdminApproval.jsx";
import MyBlogsPage from "./Components/Auth/MyBlogsPage.jsx";
import UserOrder from "./Components/Pages/Orders/UserOrder.jsx";
import OrderList from "./Components/Pages/Admin/OrderList.jsx";
import { AdminDashboard } from "./Components/Pages/Admin/AdminDashboard.jsx";
import AboutUs from "./Components/Pages/AboutUs.jsx";
import PremiumSubscription from "./Components/Auth/PremiumSubscription.jsx";
import ProductApproval from "./Components/Pages/Admin/AdminApproval.jsx";
import ProductSubmission from "./Components/Pages/Admin/ProductSubmission.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route
        path="/favorite"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/premium-subscription"
        element={
          <ProtectedRoute>
            <PremiumSubscription />
          </ProtectedRoute>
        }
      />
      <Route path="/shop" element={<Shop />} />
      <Route path="/my-orders" element={<UserOrder />} />

      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/admin-approve" element={<ProductApproval />} />

      <Route path="/esewa" element={<EsewaPayment />} />

      <Route path="/blog" element={<BlogSection />} />
      <Route
        path="/my-blogs"
        element={
          <ProtectedRoute>
            <MyBlogsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product-submission"
        element={
          <ProtectedRoute>
            <ProductSubmission />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-blog"
        element={
          <ProtectedRoute>
            <CreateBlogPage />
          </ProtectedRoute>
        }
      />
      <Route path="/blog/:id" element={<BlogDetailsPage />} />
      <Route
        path="/blogs/edit/:id"
        element={
          <ProtectedRoute>
            <UpdateBlogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/addrecipes"
        element={
          <ProtectedRoute>
            <AddRecipePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipes/edit/:id"
        element={
          <ProtectedRoute>
            <EditRecipe />
          </ProtectedRoute>
        }
      />
      <Route path="/recipes" element={<RecipeListPage />} />
      <Route path="/recipes/:id" element={<ViewRecipePage />} />
      <Route
        path="/my-recipes"
        element={
          <ProtectedRoute>
            <MyRecipesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-profile"
        element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shipping"
        element={
          <ProtectedRoute>
            <Shipping />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/:id"
        element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        }
      />
      <Route
        path="/placeorder"
        element={
          <ProtectedRoute>
            <PlaceOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route path="/design" element={<CheckDesign />} />
      <Route
        path="/saved-recipes"
        element={
          <ProtectedRoute>
            <SavedRecipes />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoutes />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="orderlist" element={<OrderList />} />
        {/* <Route path="productlist/:pageNumber" element={<ProductList />} /> */}
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

store.dispatch(restoreAuth());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
