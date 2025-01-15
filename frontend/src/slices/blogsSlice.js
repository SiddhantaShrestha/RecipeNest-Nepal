import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  blogs: [], // All blogs
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
    deleteBlogStart(state) {
      state.isLoading = true;
      state.status = "loading";
      state.error = null;
    },
    deleteBlogSuccess(state, action) {
      state.isLoading = false;
      state.status = "succeeded";
      state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
    },
    deleteBlogFailure(state, action) {
      state.isLoading = false;
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  fetchBlogsStart,
  fetchBlogsSuccess,
  fetchBlogsFailure,
  fetchBlogStart,
  fetchBlogSuccess,
  fetchBlogFailure,
  deleteBlogStart,
  deleteBlogSuccess,
  deleteBlogFailure,
} = blogsSlice.actions;

// Async actions to be used in components
export const fetchBlogs = () => async (dispatch) => {
  dispatch(fetchBlogsStart());
  try {
    const response = await axios.get("http://localhost:8000/blogs");
    dispatch(fetchBlogsSuccess(response.data.blogs));
  } catch (error) {
    dispatch(fetchBlogsFailure(error.message));
  }
};

export const fetchBlog = (id) => async (dispatch) => {
  dispatch(fetchBlogStart());
  try {
    const response = await axios.get(`http://localhost:8000/blogs/${id}`);
    dispatch(fetchBlogSuccess(response.data.blog));
  } catch (error) {
    dispatch(fetchBlogFailure(error.message));
  }
};

export const deleteBlog = (id) => async (dispatch) => {
  dispatch(deleteBlogStart());
  try {
    const token = localStorage.getItem("authToken");
    await axios.delete(`http://localhost:8000/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(deleteBlogSuccess(id));
  } catch (error) {
    dispatch(deleteBlogFailure(error.message));
  }
};

export default blogsSlice.reducer;
