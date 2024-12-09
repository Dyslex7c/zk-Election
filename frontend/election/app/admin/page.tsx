"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AdminDashboard from "./dashboard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import Loader from "@/components/Loader/Loader";

const ADMIN_ADDRESSES = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null | undefined | "">(null);

  useEffect(() => {
    const walletAddress = Cookies.get("walletAddress");
    const adminCheck = walletAddress && ADMIN_ADDRESSES === walletAddress;
    setIsAdmin(adminCheck);

    if (!adminCheck) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin page.",
        variant: "destructive",
      });
    }
  }, []);

  if (isAdmin === null) {
    return <Loader isAdmin={isAdmin} />;
  }

  return isAdmin ? (
    <AdminDashboard />
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-center mb-6 text-red-500">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Sorry, you do not have permission to access the admin page. If you
          believe this to be an error, please contact support.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => router.push("/")} variant="default">
            Go to Home
          </Button>
          <Button onClick={() => router.push("/contact")} variant="outline">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
