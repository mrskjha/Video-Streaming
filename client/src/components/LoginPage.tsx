"use client";
import { SignInSchema } from "@/types/SignupType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import z from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginUser } from "@/services/auth";
import { useAuth } from "@/contexts/authContext";
import { toast } from "sonner";

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const router = useRouter();
  const { setUser } = useAuth();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    setIsSubmitting(true);
    try {
      const { user, accessToken } = await loginUser(data);
      setIsAuthenticated(true);
      setUser(user);
      console.log(accessToken);
      localStorage.setItem("token", accessToken);
      toast.success("Login successful! Redirecting...");
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-8  rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Login to StreamHub
          </h1>
     
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your account password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
              <p className="text-center text-sm">
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Don’t have an account? Register
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
