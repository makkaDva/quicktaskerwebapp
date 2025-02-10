"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let messageSent = false;
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && !messageSent) {
        // Handle popup flow
        if (window.opener) {
          window.opener.postMessage('login-success', window.location.origin);
          messageSent = true;
          window.close();
        }
        // Handle regular redirect flow
        else {
          router.push('/find-jobs');
        }
      }
    });
  
    // Fallback in case auth state doesn't change
    const timeout = setTimeout(() => {
      if (!messageSent && window.opener) {
        window.opener.postMessage('login-timeout', window.location.origin);
        window.close();
      }
    }, 5000);

    return () => {
      subscription?.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Processing authentication...
        </h1>
        <p className="text-gray-600">
          Please wait while we log you in.
        </p>
      </div>
    </div>
  );
}