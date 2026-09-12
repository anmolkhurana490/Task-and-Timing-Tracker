"use client";

import Link from "next/link";
import { useAppStore } from "../stores/useAppStore";
import { getAuthUser } from "@/lib/authSession";
import { useEffect } from "react";
import { useAuthViewModel } from "@/features/auth/viewmodels/useAuthViewModel";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const { user, setUser } = useAppStore();
  const { logout } = useAuthViewModel();

  async function handleSignOut() {
    await logout();
    router.push("/auth/login");
  }

  useEffect(() => {
    const updateUser = async () => {
      const sessionUser = await getAuthUser();
      if (!sessionUser) return;

      const { id, name, email } = sessionUser;
      if (id && name && email) setUser({ id, name, email });
    }

    updateUser();
  }, [setUser]);

  return (
    <header className="mx-auto flex w-full max-w-310 items-center justify-between border-b border-[#d9ddd4] px-5 py-7 sm:px-8">
      <Link className="flex items-center text-[22px] font-bold tracking-[-.04em]" href="/" aria-label="Tempo home">
        <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#476257] font-serif text-[17px] text-white">T</span>tempo
      </Link>
      <nav className="flex items-center gap-3 text-sm font-bold sm:gap-7" aria-label="Main navigation">
        {user ? (
          <>
            <Link href="/dashboard">Overview</Link>
            <Link href="/tasks">Tasks</Link>
            <Link href="/time-logs">Time logs</Link>
            <form action={handleSignOut}>
              <button className="cursor-pointer border-0 bg-transparent p-0 font-inherit font-bold text-inherit" type="submit">Sign out</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/auth/login">Sign in</Link>
            <Link className="rounded-full border border-[#26302d] px-4 py-2" href="/auth/signup">Get started <span className="ml-2 text-[#df7455]" aria-hidden="true">↗</span></Link>
          </>
        )}
      </nav>
    </header>
  );
}