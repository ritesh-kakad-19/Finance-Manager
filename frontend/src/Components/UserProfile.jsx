import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircleUserRound, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { getAuthHeaders } from "@/lib/finance";

const UserProfile = () => {
  const [previewPic, setPreviewPic] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`, {
          headers: getAuthHeaders(token),
        });
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast("Failed to fetch profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, toast]);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewPic(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }
    try {
      setSaving(true);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        { name, ...(password && { password }) },
        { headers: { "Content-Type": "application/json", ...getAuthHeaders(token) } }
      );
      setPassword("");
      setConfirmPassword("");
      toast("Profile updated");
    } catch (error) {
      toast("Error updating profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="mx-auto h-[480px] max-w-2xl" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[30px] font-bold tracking-tight md:text-[34px]">Profile</h1>
        <p className="mt-1 text-[15px] text-[#A7B1C5]">Manage your personal information.</p>
      </div>

      <Card className="mx-auto max-w-2xl p-6">
        <CardHeader className="p-0 pb-6 text-center">
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Update your account details and password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="flex flex-col items-center space-y-3">
            {previewPic ? (
              <img src={previewPic} alt="Profile preview" className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-[var(--bg-input)]">
                <CircleUserRound className="h-12 w-12 text-[#A7B1C5]" />
              </div>
            )}
            <p className="text-base font-semibold">{name}</p>
            <p className="text-sm text-[#A7B1C5]">{email}</p>
            <label className="cursor-pointer text-xs font-medium text-[#16D9FF]">
              Change Picture
              <input type="file" onChange={handlePicChange} className="hidden" accept="image/*" />
            </label>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#A7B1C5]">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#A7B1C5]">Email</label>
              <Input value={email} disabled className="cursor-not-allowed opacity-70" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#A7B1C5]">New Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#A7B1C5]">Confirm Password</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" />
            </div>
            <Button variant="primary" type="submit" disabled={saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
