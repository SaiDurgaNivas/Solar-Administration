import API from "./api";

// 🔐 Admin Login
export const adminLogin = async (data) => {
  try {
    const response = await API.post("/auth/admin-login", data);

    // Save user data (with token)
    sessionStorage.setItem("user", JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Admin login failed" };
  }
};

// 👤 User Login
export const userLogin = async (data) => {
  try {
    const response = await API.post("/auth/user-login", data);

    sessionStorage.setItem("user", JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "User login failed" };
  }
};

// 📝 Register
export const registerUser = async (data) => {
  try {
    const response = await API.post("/auth/register", data);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// 🚪 Logout
export const logoutUser = () => {
  sessionStorage.removeItem("user");
};

// 📌 Get Current User
export const getCurrentUser = () => {
  return JSON.parse(sessionStorage.getItem("user"));
};