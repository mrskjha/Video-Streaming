"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader, LogOut, Moon, Search, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useAuth } from "@/contexts/authContext";
import { useVideoContext } from "@/contexts/videoContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth";

export default function Navbar() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { user, isLoading,setUser } = useAuth();
  const { searchTerm, setSearchTerm } = useVideoContext();
  const { videos } = useVideoContext();
  const [inputValue, setInputValue] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(inputValue);
  }

  const handleLogout = () => {
    setUser(null);
    logoutUser()
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="flex w-full items-center justify-between border-b px-4 py-3 shadow-sm dark:border-neutral-800 bg-background">
      {/* Left: Logo + Browse */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
          <h1 className="text-lg font-bold md:text-2xl">StreamHub</h1>
        </Link>
        {/* <Link
          href="/browse"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition hidden sm:block"
        >
          Browse
        </Link> */}
      </div>

      {/* Middle: Search Box */}
      <div className="relative w-full max-w-sm mx-4 hidden md:block">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <PlaceholdersAndVanishInput
          placeholders={["Search for streams, channels, or games..."]}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);
            setSearchTerm(value); 
          }}
          onSubmit={handleSearchSubmit}
        />
      </div>

      {/* Right: Theme Toggle + Search (Mobile) + Login */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Search Icon */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Login Button */}

        {user ? (
          <>
            <Link href="/profile" className="flex items-center">
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full inline-block mr-2"
              />
            </Link>
            <Button className="hidden md:block cursor-pointer" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button className="w-24 md:w-28 dark:bg-white dark:text-black dark:hover:bg-gray-200 cursor-pointer">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
