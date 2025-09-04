import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideImage from "../assets/SideImagelogin.png"; // Use same image or different one

const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://exclusive.runasp.net/api";

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const payload = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Email: formData.email,
      PhoneNumber: formData.phoneNumber,
      BirthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
      Password: formData.password,
    };

    try {
      const response = await fetch(`${baseUrl}/Account/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Registration response:", result);
      
      if (response.ok && result.succeeded) {
        setSuccess(true);
        
        // Clear form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          birthDate: "",
          password: "",
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: "Account created! Please login with your credentials.",
              email: payload.Email 
            } 
          });
        }, 2000);
        
      } else {
        // Handle specific error messages
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(", ");
          throw new Error(errorMessages);
        } else {
          throw new Error(result.message || "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row items-center p-4 gap-8 mt-6 min-h-screen">
      <div className="w-full lg:w-1/2 max-w-2xl">
        <img src={SideImage} alt="Sign Up Illustration" className="w-full h-auto object-cover rounded-lg" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 p-8 rounded-lg w-full md:w-1/2 lg:w-1/3 max-w-md"
      >
        <h1 className="text-4xl lg:text-5xl mb-4 font-bold">Create an account</h1>
        <p className="text-gray-600">Enter your details below</p>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Account created successfully! Redirecting to login...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            ❌ {error}
          </div>
        )}

        {/* Name fields side by side */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-1/2 border-b-2 border-gray-300 bg-transparent py-2 
                       text-gray-900 focus:border-[rgba(219,68,68,1)] focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-1/2 border-b-2 border-gray-300 bg-transparent py-2 
                       text-gray-900 focus:border-[rgba(219,68,68,1)] focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full border-b-2 border-gray-300 bg-transparent py-2 
                     text-gray-900 focus:border-[rgba(219,68,68,1)] focus:outline-none
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        <input
          type="tel"
          placeholder="Phone Number (Optional)"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          disabled={loading}
          className="w-full border-b-2 border-gray-300 bg-transparent py-2 
                     text-gray-900 focus:border-[rgba(219,68,68,1)] focus:outline-none
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        <input
          type="date"
          placeholder="Birth Date (Optional)"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          disabled={loading}
          className="w-full border-b-2 border-gray-300 bg-transparent py-2 
                     text-gray-900 focus:border-[rgba(219,68,68,1)] focus:outline-none
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          minLength={6}
          className="w-full border-b-2 border-gray-300 bg-transparent py-2 
                     text-gray-900 focus:border-[rgba(219,68,68,1)] focus:outline-none
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <button 
          type="submit"
          disabled={loading}
          className={`p-3 text-white w-full rounded-lg transition-all ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-[rgba(219,68,68,1)] hover:bg-red-600"
          }`}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-gray-600">
          Already have account?{' '}
          <Link to="/login" className="text-[rgba(219,68,68,1)] underline hover:text-red-600">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}

export default SignUp;