


import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { UseAuth } from "../context/UseAuth ";
import SideImage from "../assets/SideImagelogin.png";
import { FcGoogle } from "react-icons/fc";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://exclusive.runasp.net/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = UseAuth();
  
  // Get the page user was trying to visit before login
  const from = location.state?.from?.pathname || null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${baseUrl}/Account/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Invalid credentials or server error");
      }

      if (response.succeeded && response.data.accessToken) {
        // Store user data and tokens
        login(
          {
            id: response.data.id,
            email: response.data.email,
            role: response.data.role
          },
          response.data.accessToken,
          response.data.refreshToken
        );
  window.dispatchEvent(new Event('loginStateChanged'));
        setSuccess(true);
        
        // Role-based redirection
        setTimeout(() => {
          // Check if user is admin
          if (response.data.role && response.data.role.toLowerCase() === "admin") {
            navigate("/admin", { replace: true });
          } else if (from && from !== "/login" && from !== "/signup") {
            // If there was a specific page they were trying to access, go there
            navigate(from, { replace: true });
          } else {
            // Otherwise go to home page
            navigate("/", { replace: true });
          }
        }, 1500);
        
      } else {
        throw new Error(response.message || "Login failed - no token received");
      }
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("Google login requires backend configuration");
    window.location.href = `${baseUrl}/Account/login/google`;
  };

  return (
    <main className="flex flex-col lg:flex-row items-center p-4 gap-8 mt-6 min-h-screen my-16">
      <div className="w-full lg:w-1/2 max-w-2xl">
        <img src={SideImage} alt="Login illustration" className="w-full h-auto object-cover rounded-lg" />
      </div>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-6 p-8 rounded-lg w-full md:w-1/2 lg:w-1/3"
      >
        <h1 className="text-3xl mb-4">Log in to Exclusive</h1>
        <p>Enter your details below</p>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Login successful! Redirecting...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            ❌ {error}
          </div>
        )}

        {location.state?.message && !error && !success && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            {location.state.message}
          </div>
        )}

        <div className="flex flex-col gap-2 my-4">
          <label htmlFor="email" className="text-gray-700">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-md px-3 py-2
                       focus:border-[rgba(219,68,68,1)] focus:outline-none focus:ring-0
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2 my-4">
          <label htmlFor="password" className="text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-md px-3 py-2
                       focus:border-[rgba(219,68,68,1)] focus:outline-none focus:ring-0
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex items-center justify-between flex-col gap-4 md:flex-row">
          <button
            type="submit"
            disabled={loading}
            className={`p-3 text-white w-52 rounded-lg transition-all ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[rgba(219,68,68,1)] hover:bg-red-600"
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
          <button 
            type="button"
            className="text-[rgba(219,68,68,1)] underline hover:text-red-600"
          >
            Forget Your Password?
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[rgba(219,68,68,1)] underline hover:text-red-600">
            Sign Up
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
  
  
