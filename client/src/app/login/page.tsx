"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import axios from "axios";
import { toast } from "sonner";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { setUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
        formData
      );

      if (res.status === 200 && res.data?.message?.user) {
        setUser(res.data.message.user);
        localStorage.setItem("token", res.data.message.accessToken);
        setError(null);
        setSuccess(true);
        toast("Login successful! Redirecting...", {
          description: "You will be redirected shortly.",
          duration: 1000,
        });
        router.push("/");
      } else {
        setError("Invalid response from server");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md p-8 rounded-xl border border-white/10">
        <p className="text-3xl font-bold text-center text-white mb-6">
          Login to StreamHub
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-neutral-300">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="bg-white/10 text-white border-neutral-600"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm text-neutral-300">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-white/10 text-white border-neutral-600"
            />
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          {success && (
            <p className="text-sm text-green-400 text-center">
              Login successful! Redirecting...
            </p>
          )}

          <div className="flex flex-col gap-2 mt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            <Link
              href="/register"
              className="text-sm text-blue-400 hover:underline text-center"
            >
              Don’t have an account? Register
            </Link>
          </div>
        </form>

        <p className="text-neutral-400 mt-6 text-center text-xs">
          Ensuring your account is properly secured helps protect your personal
          information.
        </p>
      </div>
    </div>
  );
}
