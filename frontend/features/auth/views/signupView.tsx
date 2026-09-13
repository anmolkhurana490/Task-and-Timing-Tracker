"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthViewModel } from "../auth.viewmodel";
import { useRouter } from "next/navigation";
import { signupSchema, type SignupFormValues } from "../auth.validation";
import { validateFormData } from "@/lib/validation";

export default function SignupView() {
  const { error, isSubmitting, register } = useAuthViewModel();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignupFormValues, string>>>({});

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    const data = { name, email, password };
    const validated = validateFormData<SignupFormValues>(signupSchema, data);

    if (validated.success) {
      setFieldErrors({});
      const res = await register(validated.data!);
      if (res.success) router.push("/tasks");
    }
    else {
      setFieldErrors(validated.errors!);
    }
  }

  return (
    <section className="mx-auto grid min-h-0 max-w-260 items-center gap-11 px-5 py-12 sm:px-8 sm:py-17 md:min-h-[calc(100vh-170px)] md:grid-cols-[minmax(0,.9fr)_minmax(360px,470px)] md:gap-[9%]">
      <div>
        <p className="mb-5 text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">A better rhythm</p>
        <h1 className="font-serif text-[48px] font-normal leading-none tracking-[-.045em] sm:text-[68px]">Build a workday you can return to.</h1>
        <p className="max-w-100 text-[17px] leading-[1.6] text-[#6d7973]">Create a quiet home for the work that matters, one intentional block at a time.</p>
      </div>

      <div className="border border-[#d9ddd4] bg-[#fffefa] p-7 shadow-[10px_10px_0_#dce3d8] sm:p-9">
        <div>
          <span className="mb-4 block text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">Tempo workspace</span>
          <h2 className="mb-2 font-serif text-[38px] font-normal tracking-[-.045em]">Create your account</h2>
          <p className="mb-7 text-sm text-[#6d7973]">Start with the essentials. You can shape the rest later.</p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
          <label className="grid gap-2 text-[13px] font-bold">
            Name
            <input className="w-full border border-[#d9ddd4] bg-transparent px-3.5 py-3 text-[15px] outline-none focus:border-[#476257] focus:ring-[3px] focus:ring-[#dce7db]" required autoComplete="name" value={name} onChange={(event) => { setName(event.target.value); setFieldErrors((current) => ({ ...current, name: undefined })); }} placeholder="Your name" aria-invalid={Boolean(fieldErrors.name)} />
            {fieldErrors.name && <span className="text-xs font-normal text-[#a54e39]">{fieldErrors.name}</span>}
          </label>

          <label className="grid gap-2 text-[13px] font-bold">
            Email
            <input className="w-full border border-[#d9ddd4] bg-transparent px-3.5 py-3 text-[15px] outline-none focus:border-[#476257] focus:ring-[3px] focus:ring-[#dce7db]" required type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setFieldErrors((current) => ({ ...current, email: undefined })); }} placeholder="you@example.com" aria-invalid={Boolean(fieldErrors.email)} />
            {fieldErrors.email && <span className="text-xs font-normal text-[#a54e39]">{fieldErrors.email}</span>}
          </label>

          <label className="grid gap-2 text-[13px] font-bold">
            Password
            <input className="w-full border border-[#d9ddd4] bg-transparent px-3.5 py-3 text-[15px] outline-none focus:border-[#476257] focus:ring-[3px] focus:ring-[#dce7db]" required type="password" minLength={8} autoComplete="new-password" value={password} onChange={(event) => { setPassword(event.target.value); setFieldErrors((current) => ({ ...current, password: undefined })); }} placeholder="8 characters minimum" aria-invalid={Boolean(fieldErrors.password)} />
            {fieldErrors.password && <span className="text-xs font-normal text-[#a54e39]">{fieldErrors.password}</span>}
          </label>

          {error && <p className="border-l-[3px] border-[#df7455] bg-[#fff0eb] px-3 py-3 text-[13px] leading-[1.4] text-[#a54e39]" role="alert">{error}</p>}

          <button className="mt-1 inline-flex w-full justify-center rounded-full bg-[#476257] px-5 py-4 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Working..." : "Create account"} <span className="ml-2 text-[#df7455]" aria-hidden="true">↗</span>
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-[#6d7973]">Already have an account? <Link className="font-bold text-[#476257] underline underline-offset-4" href="/auth/login">Sign in</Link></p>
      </div>
    </section>
  );
}
