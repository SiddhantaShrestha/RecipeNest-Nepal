import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../api";

const initialState = {
  blogs: [], // All blogs
  userBlogs: [], // User's blogs specifically
  blog: null, // Single blog details
  isLoading: false, // Loading state
  status: "idle",
  error: null, // Error message
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    fetchBlogsStart(state) {
      state.isLoading = true;
      state.status = "loading";
      state.error = null;
    },
    fetchBlogsSuccess(state, action) {
      state.isLoading = false;
      state.status = "succeeded";
      state.blogs = action.payload;
    },
    fetchBlogsFailure(state, action) {
      state.isLoading = false;
      state.status = "failed";
      state.error = action.payload;
    },
    fetchBlogStart(state) {
      state.isLoading = true;
      state.status = "loading";
      state.error = null;
    },
    fetchBlogSuccess(state, action) {
      state.isLoading = false;
      state.status = "succeeded";
      state.blog = action.payload;
    },
    fetchBlogFailure(state, action) {
      state.isLoading = false;
      state.status = "failed";
      state.error = action.payload;
    },
    fetchUserBlogsStart(state) {
      state.isLoading = true;
      state.status = "loading";
      state.error = null;
    },
    fetchUserBlogsSuccess(state, action) {
      state.isLoading = false;
      state.status = "succeeded";
      state.userBlogs = action.payload;
    },
    fetchUserBlogsFailure(state, action) {
      state.isLoading = false;
      state.status = "failed";
      state.error = action.payload;
    },
    deleteBlogStart(state) {
      state.isLoading = true;
      state.status = "loading";
      state.error = null;
    },
    deleteBlogSuccess(state, action) {
      state.isLoading = false;
      state.status = "succeeded";
      state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      state.userBlogs = state.userBlogs.filter(
        (blog) => blog._id !== action.payload
      );
    },
    deleteBlogFailure(state, action) {
      state.isLoading = false;
      state.status = "failed";
      state.error = action.payload;
    },
    updateBlogStart(state) {
      state.isLoading = true;
      state.status = "loading";
      state.error = null;
    },
    updateBlogSuccess(state, action) {
      state.isLoading = false;
      state.status = "succeeded";
      state.blogs = state.blogs.map((blog) =>
        blog._id === action.payload._id ? action.payload : blog
      );
      state.userBlogs = state.userBlogs.map((blog) =>
        blog._id === action.payload._id ? action.payload : blog
      );
      state.blog = action.payload;
    },
    updateBlogFailure(state, action) {
      state.isLoading = false;
      state.status = "failed";
      state.error = action.payload;
    },
    createBlogStart(state) {
      state.isLoading = true;
      state.status = "loading";
      state.error = null;
    },
    createBlogSuccess(state, action) {
      state.isLoading = false;
      state.status = "succeeded";
      state.userBlogs = [action.payload, ...state.userBlogs];
      state.blogs = [action.payload, ...state.blogs];
    },
    createBlogFailure(state, action) {
      state.isLoading = false;
      state.status = "failed";
      state.error = action.payload;
    },
    setBlogs(state, action) {
      state.blogs = action.payload;
    },
    addBlog(state, action) {
      state.blogs.push(action.payload);
      state.userBlogs.push(action.payload);
    },
    setCurrentBlog(state, action) {
      state.currentBlog = action.payload;
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      if (!updatedBlog || !updatedBlog._id) {
        console.error("Invalid blog data received:", updatedBlog);
        return;
      }

      // Update in the list of all blogs
      const index = state.blogs.findIndex(
        (blog) => blog._id === updatedBlog._id
      );
      if (index !== -1) {
        state.blogs[index] = updatedBlog;
      }

      // Update the current blog if it's the same as the updated one
      if (state.currentBlog && state.currentBlog._id === updatedBlog._id) {
        state.currentBlog = updatedBlog;
      }

      // Update in the user's blogs if applicable
      const userBlogIndex = state.userBlogs.findIndex(
        (blog) => blog._id === updatedBlog._id
      );
      if (userBlogIndex !== -1) {
        state.userBlogs[userBlogIndex] = updatedBlog;
      }
    },
    setUserBlogs(state, action) {
      state.userBlogs = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    deleteBlog(state, action) {
      const blogId = action.payload;
      state.blogs = state.blogs.filter((blog) => blog._id !== blogId);
      state.userBlogs = state.userBlogs.filter((blog) => blog._id !== blogId);
      if (state.currentBlog && state.currentBlog._id === blogId) {
        state.currentBlog = null;
      }
    },
  },
});

export const {
  setBlogs,
  setCurrentBlog,
  setUserBlogs,
  setLoading,
  setError,
  fetchBlogsStart,
  fetchBlogsSuccess,
  fetchBlogsFailure,
  fetchBlogStart,
  fetchBlogSuccess,
  fetchBlogFailure,
  fetchUserBlogsStart,
  fetchUserBlogsSuccess,
  fetchUserBlogsFailure,
  deleteBlogStart,
  deleteBlogSuccess,
  deleteBlogFailure,
  updateBlogStart,
  updateBlogSuccess,
  updateBlogFailure,
  createBlogStart,
  createBlogSuccess,
  createBlogFailure,
} = blogsSlice.actions;

// Async actions to be used in components
export const fetchBlogs = () => async (dispatch) => {
  dispatch(fetchBlogsStart());
  try {
    const response = await api.get("/blogs");
    dispatch(fetchBlogsSuccess(response.data.blogs));
  } catch (error) {
    dispatch(fetchBlogsFailure(error.message));
  }
};

export const fetchBlog = (id) => async (dispatch) => {
  dispatch(fetchBlogStart());
  try {
    const response = await api.get(`/blogs/${id}`);
    dispatch(fetchBlogSuccess(response.data.blog));
  } catch (error) {
    dispatch(fetchBlogFailure(error.message));
  }
};

export const fetchUserBlogs = () => async (dispatch) => {
  dispatch(fetchUserBlogsStart());
  try {
    const token = localStorage.getItem("authToken");

    const response = await api.get("/blogs/my-blogs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(fetchUserBlogsSuccess(response.data.blogs));
  } catch (error) {
    dispatch(
      fetchUserBlogsFailure(error.response?.data?.message || error.message)
    );
  }
};

export const deleteBlog = (id) => async (dispatch) => {
  dispatch(deleteBlogStart());
  try {
    const token = localStorage.getItem("authToken");
    await api.delete(`/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(deleteBlogSuccess(id));
  } catch (error) {
    dispatch(deleteBlogFailure(error.response?.data?.message || error.message));
  }
};

export const updateBlog = (id, formData) => async (dispatch) => {
  dispatch(updateBlogStart());
  try {
    const token = localStorage.getItem("authToken");
    const response = await api.patch(`/blogs/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(updateBlogSuccess(response.data.blog));
    return response.data.blog;
  } catch (error) {
    dispatch(updateBlogFailure(error.response?.data?.message || error.message));
    throw error;
  }
};

export const createBlog = (formData) => async (dispatch) => {
  dispatch(createBlogStart());
  try {
    const token = localStorage.getItem("authToken");
    const response = await api.post("/blogs", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(createBlogSuccess(response.data.blog));
    return response.data.blog;
  } catch (error) {
    dispatch(createBlogFailure(error.response?.data?.message || error.message));
    throw error;
  }
};

export default blogsSlice.reducer;
