import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
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

import App from "./App";
import "./index.css";
import { PersistGate } from "redux-persist/lib/integration/react";
import Signup from "./Components/Signup.jsx";
import Login from "./Components/Login.jsx";
import VerifyEmail from "./Components/VerifyEmail";
import NotFound from "./Components/NotFound";
import HomePage from "./Components/HomePage.jsx";
import ResetPassword from "./Components/ResetPassword";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import BlogSection from "./Components/BlogSection.jsx";
import CreateBlogPage from "./Components/CreateBlogPage.jsx";
import BlogDetailsPage from "./Components/BlogDetailsPage.jsx";
import UpdateBlogPage from "./Components/UpdateBlogPage.jsx";
import AddRecipePage from "./Components/AddRecipePage.jsx";
import RecipeListPage from "./Components/RecipeListPage.jsx";
import ViewRecipePage from "./Components/ViewRecipePage.jsx";
import MyProfile from "./Components/MyProfile.jsx";
import ChangePassword from "./Components/ChangePassword.jsx";
import MyBlogs from "./Components/MyBlogs.jsx";
import CheckDesign from "./Components/checkdesign.jsx";
import SavedRecipes from "./Components/SavedRecipes.jsx";
import MyRecipesPage from "./Components/MyRecipesPage.jsx";
import EditRecipe from "./Components/EditRecipe.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import AdminRoutes from "./Components/Admin/AdminRoutes.jsx";
import UserList from "./Components/Admin/UserList.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/blog" element={<BlogSection />} />
      <Route
        path="/my-blogs"
        element={
          <ProtectedRoute>
            <MyBlogs />
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
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Remove ToastContainer from here */}
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
