import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./brand/Logo";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, formData);
      localStorage.setItem("userToken", data.token);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid Credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="app-atmosphere flex min-h-screen items-center justify-center p-4">
      <div className="page-enter w-full max-w-md space-y-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-[#A7B1C5] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="glass-card p-8">
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              <Logo showWordmark={false} size="lg" />
            </div>
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="mt-1 text-sm text-[#A7B1C5]">Sign in to Financely</p>
          </div>

          {message ? (
            <div className="mb-4 rounded-xl border border-[#FF4545]/30 bg-[#FF4545]/10 p-3 text-sm text-[#FF4545]">
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-[#A7B1C5]">Email</label>
              <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm text-[#A7B1C5]">Password</label>
                <button type="button" onClick={() => navigate("/forgot-password")} className="text-xs text-[#16D9FF]">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#6F7B91]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign In
            </Button>
          </form>

          <p className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-[#A7B1C5]">
            Don&apos;t have an account?{" "}
            <button onClick={() => navigate("/signup")} className="font-semibold text-[#16D9FF]">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
