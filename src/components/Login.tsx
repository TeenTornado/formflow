import React, { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

interface LoginProps {
  onLogin: (userData: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isSignUp ? "/auth/signup" : "/auth/login";
      const response = await axios.post(`${API_URL}${endpoint}`, {
        email,
        password,
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      // Set authorization header for future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      // Call the onLogin callback with user data
      onLogin(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    // Implement social login logic here
    console.log(`${provider} login clicked`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side remains the same */}
      <div className="w-1/2 bg-black p-12 flex flex-col">
        {/* ... existing left side code ... */}
      </div>

      {/* Right side - Updated form */}
      <div className="w-1/2 p-12 flex flex-col">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <Globe size={20} />
            <span>English</span>
            <ChevronDown size={16} />
          </div>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm hover:underline"
          >
            {isSignUp ? "Already have an account?" : "Need an account?"}
          </button>
        </div>

        <div className="max-w-md mx-auto w-full flex-1">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">FormFlow</h1>
            <p className="text-gray-600">
              Create interactive forms and surveys with ease.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => handleSocialLogin("google")}
              className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              type="button"
            >
              {isSignUp ? "Sign up" : "Sign in"} with Google
            </button>
            <button
              onClick={() => handleSocialLogin("microsoft")}
              className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              type="button"
            >
              {isSignUp ? "Sign up" : "Sign in"} with Microsoft
            </button>
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : `${isSignUp ? "Sign up" : "Sign in"} with email`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
