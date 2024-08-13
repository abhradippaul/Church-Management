"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function HomePage() {
  const navigate = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            Church Management Information
          </h1>
          <p className="text-gray-700 text-lg text-center">
            Welcome to the church management system. Please login to access your
            account.
          </p>
        </div>
        <div className="w-full flex items-center justify-center">
          <Button onClick={() => navigate.push("/sign-in")} className="w-[40%]">
            Church/Visitor Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
