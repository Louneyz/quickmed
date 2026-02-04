"use client";

import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Redirect to the JotForm URL
        window.location.href = "https://form.jotform.com/232048707287057";
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Column - Form */}
            <div className="flex w-full flex-col justify-center bg-[#a6a6a6] px-8 sm:px-12 lg:w-1/2 lg:px-16 xl:px-24">
                <div className="mx-auto w-full max-w-sm">
                    <h1 className="mb-8 text-3xl font-bold text-gray-900">Login</h1>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-400"></span>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-[#a6a6a6] px-2 text-gray-600">
                                Or, sign in with your email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full rounded-md border-0 bg-white/50 py-3 pl-10 text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 shadow-sm"
                                placeholder="Email"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="block w-full rounded-md border-0 bg-white/50 py-3 pl-10 pr-10 text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 shadow-sm"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <Link
                                href="#"
                                className="text-sm font-medium text-blue-700 hover:text-blue-600"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Button
                                type="submit"
                                className="w-full bg-[#2D7A9C] py-6 text-base hover:bg-[#236480]"
                                disabled={isLoading}
                            >
                                {isLoading ? "Redirecting..." : "Login"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-gray-400 bg-transparent py-6 text-base hover:bg-white/10"
                            >
                                Login with secure code
                            </Button>
                        </div>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-600">New User? </span>
                            <Link
                                href="#"
                                className="font-medium text-blue-700 hover:text-blue-600"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="absolute bottom-8 left-8 flex items-center text-sm text-gray-600 lg:left-12 lg:px-16 xl:px-24">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>info@quickmed.ca</span>
                </div>
            </div>

            {/* Right Column - Brand */}
            <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-[#4A90B2] to-[#2D6A85] lg:flex">
                <h1 className="text-6xl font-medium tracking-wide text-white/50">
                    QuickMed
                </h1>
            </div>
        </div>
    );
}
