import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./brand/Logo";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [demoHint, setDemoHint] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setDemoHint("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/-]).{8,}$/;

    if (!emailRegex.test(formData.email)) {
      setMessage("Please enter a valid email address.");
      setSuccess(false);
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setMessage("Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.");
      setDemoHint("Demo password hint: Demo@123");
      setSuccess(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setSuccess(false);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, formData);
      setMessage("Registration successful. Redirecting to login...");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error registering user");
      setSuccess(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="app-atmosphere flex min-h-screen items-center justify-center p-4">
      <div className="page-enter w-full max-w-md space-y-6">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 text-sm text-[#A7B1C5] hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="glass-card p-8">
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              <Logo showWordmark={false} size="lg" />
            </div>
            <h2 className="text-2xl font-bold">Create your Financely account</h2>
            <p className="mt-1 text-sm text-[#A7B1C5]">Start tracking income and expenses in minutes.</p>
          </div>

          {message ? (
            <div className={`mb-4 rounded-xl border p-3 text-sm ${success ? "border-[#00D084]/30 bg-[#00D084]/10 text-[#00D084]" : "border-[#FF4545]/30 bg-[#FF4545]/10 text-[#FF4545]"}`}>
              {message}
            </div>
          ) : null}
          {demoHint ? (
            <div className="mb-4 rounded-xl border border-[#00D084]/30 bg-[#00D084]/10 p-3 text-xs text-[#00D084]">{demoHint}</div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-[#A7B1C5]">Full Name</label>
              <Input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[#A7B1C5]">Email</label>
              <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[#A7B1C5]">Password</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} required className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#6F7B91]" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[#A7B1C5]">Confirm Password</label>
              <div className="relative">
                <Input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="pr-10" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-[#6F7B91]" aria-label="Toggle confirm password visibility">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Register
            </Button>
          </form>

          <p className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-[#A7B1C5]">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="font-semibold text-[#16D9FF]">Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
