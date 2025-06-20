'use client';

import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"
import { LayoutDashboard, Play, Home as HomeIcon } from "lucide-react";

export default function Home() {
  const { data: session } = useSession()

  if(session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {session.user.name}!</h1>
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="flex flex-col gap-4">
          <p className="text-center sm:text-left">
            Not signed in
          </p>
          <button 
            onClick={() => signIn('google')}
            className="rounded-full bg-blue-600 text-white px-5 py-2.5 font-medium hover:bg-blue-700 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Image 
              src="/google-logo.svg"
              width={20}
              height={20}
              alt="Google logo"
            />
            Sign in with Google
          </button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
