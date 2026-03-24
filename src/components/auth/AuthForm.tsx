"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

type AuthFormProps = {
  initialMode: "signin" | "signup";
  initialRole: "talk" | "listen";
  initialError?: string;
  initialDetails?: string;
};

export default function AuthForm({
  initialMode,
  initialRole,
  initialError = "",
  initialDetails = "",
}: AuthFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isSignUp = initialMode === "signup";
  const role = initialRole;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const urlError = initialError;
  const debugDetails = initialDetails;
  const postAuthDestination =
    role === "listen"
      ? isSignUp
        ? "/join/apply"
        : "/listener/dashboard"
      : "/explore";
  const postAuthHint =
    role === "listen"
      ? isSignUp
        ? "Listener signup continues to the application form."
        : "Listener sign-in opens your dashboard."
      : isSignUp
        ? "Talker signup takes you straight to explore."
        : "Talker sign-in opens explore.";

  const oauthError =
    urlError === "google_not_configured"
      ? "Google OAuth is not configured yet."
      : urlError === "google_start_failed"
        ? `Google sign-in could not be started.${debugDetails ? ` ${debugDetails}` : " Please try again."}`
      : urlError === "auth_schema_outdated"
        ? "Your database schema is out of date for auth. Run `npx prisma db push`, then restart `npm run dev`."
      : urlError === "google_session_expired"
        ? "Your Google sign-in session expired. Please try again."
        : urlError === "google_access_denied"
          ? "Google sign-in was cancelled."
          : urlError === "google_invalid_callback"
            ? "Google sign-in returned an invalid response."
            : urlError === "google_email_in_use"
              ? "That email is already being used by another sign-in method."
              : urlError === "google_account_not_found"
                ? "No Google account exists for this role yet. Create an account first."
                : urlError === "google_role_mismatch"
                  ? "That Google account is linked to a different role."
                  : urlError === "google_auth_failed"
                    ? `Google sign-in failed.${debugDetails ? ` ${debugDetails}` : " Please try again."}`
                    : "";

  const updateAuthState = (nextMode: "signin" | "signup", nextRole: "talk" | "listen") => {
    const params = new URLSearchParams();
    params.set("mode", nextMode);
    params.set("role", nextRole);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setError("");
  };

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    if (error) {
      setError("");
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) {
      setError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) {
      setError("");
    }
  };

  const roleCopy =
    role === "listen"
      ? {
          title: "Become a trusted listener.",
          description: "Create your listener account to apply, complete onboarding, and start supporting others.",
          signUpHeading: "Create your listener account",
          signUpDescription: "Apply to join Konfide and start your onboarding journey.",
          signInHeading: "Welcome back, listener",
          signInDescription: "Sign in to manage applications, sessions, and availability.",
          submitSignUp: "Create Listener Account",
          submitSignIn: "Sign In as Listener",
        }
      : {
          title: "Find your perfect listener.",
          description: "A safe, professional space for meaningful human connection and emotional support.",
          signUpHeading: "Create your account",
          signUpDescription: "Start your journey toward meaningful connection.",
          signInHeading: "Welcome back",
          signInDescription: "Please enter your details to continue your journey.",
          submitSignUp: "Create Account",
          submitSignIn: "Sign In",
        };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(isSignUp ? "/api/auth/signup" : "/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          role,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? ((await response.json()) as { error?: string })
        : { error: await response.text() };

      if (!response.ok) {
        setError(payload.error || "Something went wrong. Please try again.");
        return;
      }

      router.push(postAuthDestination);
      router.refresh();
    } catch {
      setError("We couldn't reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <Navbar />

      <main className="pt-20">
        <div className="min-h-[calc(100svh-5rem)] lg:flex">
          <section className="hidden lg:flex lg:w-5/12 xl:w-1/2 items-center justify-center p-8 xl:p-12 relative overflow-hidden bg-surface-container-low border-r border-on-surface/5">
            <div className="absolute top-[20%] right-[-10%] w-72 h-72 rounded-full bg-primary-container/20 blur-[100px]" />
            <div className="absolute bottom-[10%] left-[-5%] w-48 h-48 rounded-full bg-secondary-container/10 blur-[80px]" />

            <div className="max-w-sm relative z-10">
              <h1 className="text-3xl xl:text-4xl font-bold text-on-surface tracking-tight leading-[1.08] mb-3">
                {roleCopy.title}
              </h1>
              <p className="text-on-surface-variant text-base leading-relaxed max-w-xs">
                {roleCopy.description}
              </p>
              <div className="mt-6 flex gap-3 items-center">
                <div className="flex -space-x-3">
                  <Image src="/images/portrait_one_1774343011664.png" width={32} height={32} alt="User" className="w-8 h-8 rounded-full border-2 border-surface object-cover bg-surface-container-high" />
                  <Image src="/images/portrait_two_1774343033404.png" width={32} height={32} alt="User" className="w-8 h-8 rounded-full border-2 border-surface object-cover bg-surface-container-high" />
                  <Image src="/images/portrait_four_1774343074850.png" width={32} height={32} alt="User" className="w-8 h-8 rounded-full border-2 border-surface object-cover bg-surface-container-high" />
                </div>
                <span className="text-xs font-medium text-on-surface-variant">Joined by 2,000+ others today</span>
              </div>
            </div>
          </section>

          <section className="flex-1 bg-surface flex items-start lg:items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:p-8">
            <div className="w-full max-w-[420px]">
              <div className="lg:hidden mb-5 rounded-[24px] border border-on-surface/5 bg-surface-container-low px-5 py-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-[-30%] right-[-10%] h-36 w-36 rounded-full bg-primary-container/25 blur-3xl" />
                <div className="relative z-10">
                  <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-on-surface-variant mb-2">
                    Konfide
                  </p>
                  <h1 className="text-2xl font-bold text-on-surface tracking-tight leading-[1.1]">
                    {roleCopy.title}
                  </h1>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-on-surface-variant">
                    {roleCopy.description}
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-on-surface/5 bg-surface/90 p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:p-6">
                <div className="mb-4 flex gap-1 bg-surface-container p-1 rounded-none">
                  <button
                    type="button"
                    onClick={() => updateAuthState(isSignUp ? "signup" : "signin", "talk")}
                    className={`flex-1 py-2 text-xs rounded-none transition-all duration-200 ${role === "talk" ? "bg-surface-container-lowest text-on-surface shadow-sm font-semibold" : "text-on-surface-variant hover:text-on-surface font-medium"}`}
                  >
                    I need to talk
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAuthState(isSignUp ? "signup" : "signin", "listen")}
                    className={`flex-1 py-2 text-xs rounded-none transition-all duration-200 ${role === "listen" ? "bg-surface-container-lowest text-on-surface shadow-sm font-semibold" : "text-on-surface-variant hover:text-on-surface font-medium"}`}
                  >
                    I want to listen
                  </button>
                </div>

                <div className="mb-4 flex border-b border-on-surface/10">
                  <button
                    type="button"
                    onClick={() => updateAuthState("signin", role)}
                    className={`flex-1 pb-2 text-xs transition-all border-b-2 ${!isSignUp ? "font-bold border-primary text-on-surface" : "font-medium border-transparent text-on-surface-variant hover:text-on-surface"}`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAuthState("signup", role)}
                    className={`flex-1 pb-2 text-xs transition-all border-b-2 ${isSignUp ? "font-bold border-primary text-on-surface" : "font-medium border-transparent text-on-surface-variant hover:text-on-surface"}`}
                  >
                    Create Account
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-left mb-3">
                    <h2 className="text-xl font-bold text-on-surface tracking-tight mb-1">
                      {isSignUp ? roleCopy.signUpHeading : roleCopy.signInHeading}
                    </h2>
                    <p className="text-on-surface-variant text-xs">
                      {isSignUp ? roleCopy.signUpDescription : roleCopy.signInDescription}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {isSignUp ? (
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant ml-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="Alex Johnson"
                          value={fullName}
                          onChange={(event) => handleFullNameChange(event.target.value)}
                          autoComplete="name"
                          disabled={isSubmitting}
                          required
                          className="w-full px-3 py-2.5 bg-surface-container border border-on-surface/5 rounded-none text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                      </div>
                    ) : null}

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant ml-1">Email address</label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(event) => handleEmailChange(event.target.value)}
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        disabled={isSubmitting}
                        required
                        className="w-full px-3 py-2.5 bg-surface-container border border-on-surface/5 rounded-none text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant">Password</label>
                        {!isSignUp ? (
                          <span className="text-[11px] font-bold text-on-surface-variant/60">
                            Reset soon
                          </span>
                        ) : null}
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => handlePasswordChange(event.target.value)}
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        disabled={isSubmitting}
                        required
                        className="w-full px-3 py-2.5 bg-surface-container border border-on-surface/5 rounded-none text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>

                    {error || oauthError ? (
                      <p aria-live="polite" className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                        {error || oauthError}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      className="w-full bg-primary text-on-surface font-bold py-2.5 rounded-none text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all active:scale-[0.98] mt-1 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Please wait..." : isSignUp ? roleCopy.submitSignUp : roleCopy.submitSignIn}
                    </button>
                  </form>

                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-on-surface/10" />
                    </div>
                    <div className="relative flex justify-center text-[10px]">
                      <span className="bg-surface px-3 text-on-surface-variant font-bold tracking-widest uppercase">Or continue with</span>
                    </div>
                  </div>

                  <Link
                    href={`/api/auth/google/start?mode=${isSignUp ? "signup" : "signin"}&role=${role}`}
                    className="w-full flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high border border-on-surface/10 py-2.5 rounded-none font-bold text-sm text-on-surface transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </Link>

                  <p className="text-center text-[11px] leading-relaxed text-on-surface-variant">
                    {postAuthHint} You&apos;ll continue to <span className="font-semibold text-on-surface">{postAuthDestination}</span>.
                  </p>

                  <p className="text-center text-xs text-on-surface-variant">
                    {isSignUp ? "Already have an account?" : "Need a new account?"}{" "}
                    <button
                      type="button"
                      onClick={() => updateAuthState(isSignUp ? "signin" : "signup", role)}
                      className="font-semibold text-on-surface hover:text-primary transition-colors"
                    >
                      {isSignUp ? "Sign in instead" : "Create one here"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
