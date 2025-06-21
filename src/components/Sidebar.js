'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { MoreVertical, LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Image from 'next/image'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SidebarContext = createContext()

export default function Sidebar({ children, isMobileMenuOpen, setMobileMenuOpen }) {
  const [expanded, setExpanded] = useState(true)
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
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
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-10"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static h-screen bg-white border-r shadow-sm 
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 z-20
        `}
      >
        <nav className="h-full flex flex-col">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src="https://img.logoipsum.com/243.svg"
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
              alt=""
            />
            <button onClick={() => setExpanded(curr => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 hidden md:block">
              {expanded ? <ChevronLeft /> : <ChevronRight />}
            </button>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 md:hidden">
              <X />
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          {session ? (
            <div className="border-t flex p-3 items-center">
              <img
                src={session.user.user_metadata.avatar_url || 'https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=' + (session.user.user_metadata.full_name || session.user.email)}
                alt=""
                className="w-10 h-10 rounded-md"
              />
              <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                <div className="leading-4 flex-1 truncate">
                  <h4 className="font-semibold truncate">{session.user.user_metadata.full_name || session.user.email}</h4>
                </div>
                <button onClick={handleSignOut} className="p-1.5 rounded-lg hover:bg-gray-100">
                    <LogOut size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t p-3">
              {/* Not logged in */}
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}

export function SidebarItem({ icon, text, active, alert, href = '#', target }) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <li
      className={`
        relative rounded-md group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
      `}
    >
      <Link 
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className="flex items-center py-2 px-3 my-1"
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
      </Link>
      
      {alert && (
        <div
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded bg-indigo-400`}
        />
      )}

      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm whitespace-nowrap
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </li>
  )
} 