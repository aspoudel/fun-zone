"use client";

import { Button } from "./button";

export default function LoginForm() {
  return (
    <form className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-10 pb-3 pt-8">
        <h1 className="mb-3 text-2xl">Log in</h1>
        <div className="w-full">
          <div>
            <label
              htmlFor="email"
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full">Log in</Button>
      </div>
    </form>
  );
}
