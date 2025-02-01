"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js'; // Fixed package name

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        router.push("/auth/dashboard");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100"> {/* Removed extra hyphen */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4"> {/* Fixed class names */}
          Processing authentication...
        </h1>
        <p className="text-gray-600"> {/* Fixed className syntax */}
          Please wait while we log you in.
        </p>
      </div>
    </div>
  );
}