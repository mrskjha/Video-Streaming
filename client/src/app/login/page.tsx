"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import axios from "axios";
import { toast } from "sonner";
import { KeyRound, Loader2, Mail } from "lucide-react";
import { loginUser } from "@/services/auth";
import LoginPage from "@/components/LoginPage";


const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-5.067 2.4-4.354 0-7.893-3.59-7.893-8s3.54-8 7.893-8c2.347 0 4.053.947 5.027 1.907l2.586-2.587C18.453 1.407 15.867 0 12.48 0 5.867 0 0 5.867 0 12.48s5.867 12.48 12.48 12.48c7.333 0 12.053-4.947 12.053-12.267 0-.747-.053-1.44-.16-2.133H12.48z" fill="#FFFFFF" />
    </svg>
);


// export default function LoginPage() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const router = useRouter();
//   const { setUser } = useAuth();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (error) setError(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       if (!formData.email || !formData.password) {
//         throw new Error("Please fill in all fields");
//       }

//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
//         formData
//       );

//       if (res.status === 200 && res.data?.message?.user) {
//         setUser(res.data.message.user);
//         localStorage.setItem("token", res.data.message.accessToken);
//         setError(null);
//         setSuccess(true);
//         toast("Login successful! Redirecting...", {
//           description: "You will be redirected shortly.",
//           duration: 1000,
//         });
//         router.push("/");
//       } else {
//         setError("Invalid response from server");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // const [isSubmitting, setIsSubmitting] = useState(false);
//   // const router = useRouter();
//   // const { setUser } = useAuth();




  

 
//   return (
//    <div className="flex items-center justify-center min-h-screen bg-neutral-100 dark:bg-black dark:bg-dot-white/[0.2] px-4">
//       {/* Form Card with Glassmorphism effect */}
//       <div className="w-full max-w-md p-8 space-y-6 rounded-2xl border border-neutral-200 bg-white/80 shadow-xl dark:border-white/10 dark:bg-neutral-900/80 dark:shadow-2xl dark:backdrop-blur-lg">
        
//         <div className="text-center">
//             <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
//                 Welcome Back
//             </h1>
//             <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
//                 Login to continue to StreamHub
//             </p>
//         </div>

//         {/* Social Login */}
//         <div className="flex flex-col gap-3">
//              <Button variant="outline" className="w-full bg-transparent text-black dark:text-white border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
//                 <GoogleIcon />
//                 <span className="ml-3">Continue with Google</span>
//             </Button>
//         </div>

//         {/* Divider */}
//         <div className="flex items-center">
//             <div className="flex-grow border-t border-neutral-300 dark:border-neutral-700"></div>
//             <span className="mx-4 flex-shrink text-xs uppercase text-neutral-400 dark:text-neutral-500">
//                 or
//             </span>
//             <div className="flex-grow border-t border-neutral-300 dark:border-neutral-700"></div>
//         </div>

//         {/* Email/Password Form */}
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           {/* Email Input with Icon */}
//           <div className="relative">
//              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
//              <Input
//                id="email"
//                name="email"
//                type="email"
//                value={formData.email}
//                onChange={handleChange}
//                placeholder="you@example.com"
//                className="pl-10 bg-neutral-100/50 dark:bg-white/5 text-black dark:text-white border-neutral-300 dark:border-neutral-700 focus:border-blue-500"
//              />
//           </div>

//           {/* Password Input with Icon */}
//           <div className="relative">
//              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
//              <Input
//                id="password"
//                name="password"
//                type="password"
//                value={formData.password}
//                onChange={handleChange}
//                placeholder="••••••••"
//                className="pl-10 bg-neutral-100/50 dark:bg-white/5 text-black dark:text-white border-neutral-300 dark:border-neutral-700 focus:border-blue-500"
//              />
//           </div>
          
//           {/* Error and Success Messages */}
//           <div className="h-5 text-center text-sm">
//              {error && <p className="text-red-500">{error}</p>}
//              {success && <p className="text-green-500">{success}</p>}
//           </div>

//           {/* Actions */}
//           <div className="flex flex-col gap-3 pt-2">
//             <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
//               {isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
//             </Button>
//             <p className="text-center text-sm">
//                 <Link href="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
//                     Don’t have an account? Register
//                 </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

export default function page() {
  return (
    <LoginPage />
  )
}
