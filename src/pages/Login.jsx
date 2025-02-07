import { useState } from "react";
import { TextField, InputAdornment, Button, Typography } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authService.login(formData); // ✅ Use new service function
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/event-dashboard");
    } catch (error) {
      console.error(error.response?.data?.error || "Something went wrong");
      setErrors({ general: error.response?.data?.error || "Login Failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    let guestUser = JSON.parse(localStorage.getItem("user"));

    if (!guestUser || guestUser.role !== "guest") {
      guestUser = {
        id: `guest-${crypto.randomUUID()}`,
        name: "Guest User",
        role: "guest",
      };

      localStorage.setItem("user", JSON.stringify(guestUser));
    }

    // ✅ Navigate to the event dashboard
    navigate("/event-dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 3 }}
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ mb: 3 }}
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />

          {errors.general && (
            <Typography color="error" className="text-center mb-3">
              {errors.general}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              backgroundColor: "blue",
              "&:hover": { backgroundColor: "darkblue" },
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </Typography>
        </div>

        <div className="text-center mt-2">
          <Button
            variant="text"
            onClick={handleGuestLogin}
            sx={{ color: "gray", textTransform: "none" }}
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
