"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin",
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-80 space-y-4">
        <h1 className="text-xl font-bold">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full rounded border p-3 pr-16"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
          >
            {showPassword ? <IoMdEyeOff className="h-4 w-4" /> : <IoMdEye className="h-4 w-4" />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full rounded bg-black py-3 text-white"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default AdminLoginPage
