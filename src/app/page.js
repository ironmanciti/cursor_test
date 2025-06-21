'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Play, Home as HomeIcon } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: location.origin
      }
    });
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if(session) {
    const user = session.user;
    const displayName = user.user_metadata?.full_name || user.email;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {displayName}!</h1>
          <p className="text-gray-600">Where would you like to go?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <Link href="/" className="group block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all">
            <HomeIcon className="h-8 w-8 text-gray-500 mb-3 group-hover:text-indigo-600"/>
            <h2 className="text-xl font-semibold mb-1">Home</h2>
            <p className="text-gray-500">Go to the main page.</p>
          </Link>
          <Link href="/dashboard" className="group block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all">
            <LayoutDashboard className="h-8 w-8 text-gray-500 mb-3 group-hover:text-indigo-600"/>
            <h2 className="text-xl font-semibold mb-1">Dashboard</h2>
            <p className="text-gray-500">Manage your API keys.</p>
          </Link>
          <Link href="/playground" className="group block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all">
            <Play className="h-8 w-8 text-gray-500 mb-3 group-hover:text-indigo-600"/>
            <h2 className="text-xl font-semibold mb-1">Playground</h2>
            <p className="text-gray-500">Test and check your API keys.</p>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white shadow-lg rounded-2xl text-center">
        <div>
          <Image
            className="dark:invert mx-auto mb-6"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="text-gray-500 mt-2">Choose how you want to sign in</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleGoogleSignIn}
            className="w-full rounded-lg bg-blue-600 text-white px-5 py-3 font-medium hover:bg-blue-700 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Image 
              src="/google-logo.svg"
              width={20}
              height={20}
              alt="Google logo"
            />
            Sign in with Google
          </button>

          <Link
            href="/login"
            className="block w-full rounded-lg bg-gray-700 text-white px-5 py-3 font-medium hover:bg-gray-800"
          >
            Sign in with Email
          </Link>
        </div>

        <div className="text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
