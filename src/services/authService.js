import axiosClient from "../api/axiosClient";

const authService = {
  register: (userData) => axiosClient.post("/auth/register", userData),
  login: (userData) => axiosClient.post("/auth/login", userData),

  // ✅ Get current user from localStorage
  getCurrentUser: () => JSON.parse(localStorage.getItem("user")),

  // ✅ Logout user by removing token and user details
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
