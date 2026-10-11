import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./brand/Logo";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({ otp: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [demoHint, setDemoHint] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setSuccess(false);
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/forgot-password`, { email });
      setMessage("OTP sent to your email.");
      setSuccess(true);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setDemoHint("");
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/-]).{8,}$/;

    if (!passwordRegex.test(formData.newPassword)) {
      setMessage("Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.");
      setDemoHint("Demo password hint: Demo@123");
      setSuccess(false);
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setSuccess(false);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/reset-password`, {
        email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      setMessage("Password changed. Redirecting to login...");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-atmosphere flex min-h-screen items-center justify-center p-4">
      <div className="page-enter w-full max-w-md space-y-6">
        <button onClick={() => navigate("/login")} className="inline-flex items-center gap-2 text-sm text-[#A7B1C5] hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>

        <div className="glass-card p-8">
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              <Logo showWordmark={false} size="lg" />
            </div>
            <h2 className="text-2xl font-bold">Reset Password</h2>
            <p className="mt-1 text-sm text-[#A7B1C5]">Recover access to your Financely account.</p>
          </div>

          {message ? (
            <div className={`mb-4 rounded-xl border p-3 text-sm ${success ? "border-[#00D084]/30 bg-[#00D084]/10 text-[#00D084]" : "border-[#FF4545]/30 bg-[#FF4545]/10 text-[#FF4545]"}`}>
              {message}
            </div>
          ) : null}
          {demoHint ? (
            <div className="mb-4 rounded-xl border border-[#00D084]/30 bg-[#00D084]/10 p-3 text-xs text-[#00D084]">{demoHint}</div>
          ) : null}

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-[#A7B1C5]">Email</label>
                <Input type="email" placeholder="Registered email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <Input type="text" name="otp" placeholder="6-digit OTP" onChange={handleChange} required maxLength={6} />
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} name="newPassword" placeholder="New Password" onChange={handleChange} required className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#6F7B91]" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="relative">
                <Input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="pr-10" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-[#6F7B91]" aria-label="Toggle confirm password visibility">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
