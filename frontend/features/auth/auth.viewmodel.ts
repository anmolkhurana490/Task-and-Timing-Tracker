"use client";

import { registerUserAPI, logoutUserAPI } from "./auth.repository";
import type { AuthApiError } from "./auth.types";
import { signIn, signOut } from "next-auth/react";
import type { SignupFormValues, LoginFormValues } from "./auth.validation";
import { useState } from "react";
import { getAuthUser } from "@/lib/authSession";
import { useAppStore } from "@/shared/stores/useAppStore";

/** Coordinates auth form submission, session persistence. */
export function useAuthViewModel() {
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const setUser = useAppStore((state) => state.setUser);
  const clearError = () => { setError("") };

  async function register(input: SignupFormValues) {
    clearError();
    setSubmitting(true);

    try {
      const response = await registerUserAPI(input);
      setUser(response.user);
      return await login({ email: input.email, password: input.password });
    }
    catch (error) {
      const apiError = error as AuthApiError;
      setError(apiError.error ?? apiError.message ?? "Unable to continue.");
      return { success: false };
    }
    finally {
      setSubmitting(false);
    }
  }

  async function login(input: LoginFormValues) {
    clearError();
    setSubmitting(true);

    try {
      const result = await signIn("credentials", { ...input, redirect: false });

      if (result?.error) {
        const parsedError = JSON.parse(decodeURIComponent(result.code ?? "{}"));
        throw new Error(parsedError.message ?? "Sign-in failed.");
      }
      setUser(await getAuthUser());
      return { success: true };
    }
    catch (error) {
      const apiError = error as AuthApiError;
      setError(apiError.error ?? apiError.message ?? "Unable to continue.");
      return { success: false };
    }
    finally {
      setSubmitting(false);
    }
  }

  async function logout() {
    clearError();
    setSubmitting(true);

    try {
      await logoutUserAPI();
      await signOut();
      setUser(null);

      return { success: true };
    }
    catch (error) {
      console.warn("Error during logout:", error);
      await signOut(); // Ensure the user is signed out even if the API call fails
      setUser(null);

      return { success: true }; // allow sign-out even if the API call fails
    }
    finally {
      setSubmitting(false);
    }
  }

  return { error, isSubmitting, register, login, logout };
}