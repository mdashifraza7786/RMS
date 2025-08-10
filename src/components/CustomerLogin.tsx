"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CustomerLogin() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [isExisting, setIsExisting] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/customer/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (data.exists) {
        setIsExisting(true);
        await signIn("credentials", {
          userid: `cust:${mobile}`,
          password: "_customer_no_password_",
          redirect: false,
        });
        router.push("/customer/menu");
      } else {
        setIsExisting(false);
      }
    } catch (err: any) {
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, age: age ? Number(age) : undefined, gender: gender || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      await signIn("credentials", {
        userid: `cust:${mobile}`,
        password: "_customer_no_password_",
        redirect: false,
      });
      router.push("/customer/menu");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Customer Login</h2>
        {error && (
          <div className="mb-3 text-sm text-red-600">{error}</div>
        )}
        {isExisting !== false ? (
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Mobile Number</label>
              <input
                className="w-full border rounded-lg p-2 mt-1"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg py-2"
            >
              {loading ? "Please wait..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                className="w-full border rounded-lg p-2 mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Mobile Number</label>
              <input
                className="w-full border rounded-lg p-2 mt-1"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Age (optional)</label>
              <input
                className="w-full border rounded-lg p-2 mt-1"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Your age"
                type="number"
                min={1}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Gender (optional)</label>
              <select
                className="w-full border rounded-lg p-2 mt-1"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg py-2"
            >
              {loading ? "Creating..." : "Create account & Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


