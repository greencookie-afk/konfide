"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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
  const postAuthDestination = role === "listen" ? "/listener/dashboard" : "/explore";
  const postAuthHint =
    role === "listen"
      ? isSignUp
        ? "Listener signup opens your dashboard so you can finish your profile and turn on availability."
        : "Listener sign-in opens your dashboard."
      : isSignUp
        ? "Talker signup takes you straight to explore."
        : "Talker sign-in opens explore.";
  const googleAuthHref = `/api/auth/google/start?mode=${isSignUp ? "signup" : "signin"}&role=${role}`;

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
          title: "Build your listener workspace.",
          description: "Create a listener account, set your profile, turn on availability, and accept requests when you are ready.",
          signUpHeading: "Create your listener account",
          signUpDescription: "Start your listener dashboard. Profile details and availability can be added after signup.",
          signInHeading: "Welcome back, listener",
          signInDescription: "Sign in to manage your dashboard, sessions, and availability.",
          submitSignUp: "Create Listener Account",
          submitSignIn: "Sign In as Listener",
        }
      : {
          title: "Find your perfect listener.",
          description: "Browse real listener profiles, send a request, and start chatting when a listener accepts.",
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
    <main className="pt-14 sm:pt-16">
      <div className="min-h-[calc(100svh-3.5rem)] lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden border-r border-on-surface/8 bg-surface-container-low px-8 py-10 lg:flex lg:items-center lg:justify-center">
          <div className="max-w-md space-y-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                {role === "listen" ? "Listener access" : "Talker access"}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-on-surface">{roleCopy.title}</h1>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{roleCopy.description}</p>
            </div>

            <div className="border border-on-surface/8 bg-surface px-4 py-4">
              <p className="text-sm font-semibold text-on-surface">
                {role === "listen" ? "Save first, refine later" : "Browse only who is live"}
              </p>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                {role === "listen"
                  ? "Create the account, save your profile draft, and go to the dashboard right away."
                  : "Explore only shows listeners who are published and available to connect now."}
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-start justify-center bg-surface px-4 py-6 sm:px-6 sm:py-8 lg:items-center lg:px-8">
          <div className="w-full max-w-[400px] border border-on-surface/8 bg-surface-container-lowest p-4 sm:p-5">
            <div className="mb-4 flex gap-1 border border-on-surface/8 bg-surface-container p-1">
                  <button
                    type="button"
                    onClick={() => updateAuthState(isSignUp ? "signup" : "signin", "talk")}
                    className={`flex-1 py-2 text-xs transition ${role === "talk" ? "bg-surface-container-lowest font-semibold text-on-surface" : "text-on-surface-variant hover:text-on-surface"}`}
                  >
                    I need to talk
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAuthState(isSignUp ? "signup" : "signin", "listen")}
                    className={`flex-1 py-2 text-xs transition ${role === "listen" ? "bg-surface-container-lowest font-semibold text-on-surface" : "text-on-surface-variant hover:text-on-surface"}`}
                  >
                    I want to listen
                  </button>
            </div>

            <div className="mb-4 flex border-b border-on-surface/10">
                  <button
                    type="button"
                    onClick={() => updateAuthState("signin", role)}
                    className={`flex-1 border-b pb-2 text-xs transition ${!isSignUp ? "border-primary font-bold text-on-surface" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAuthState("signup", role)}
                    className={`flex-1 border-b pb-2 text-xs transition ${isSignUp ? "border-primary font-bold text-on-surface" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}
                  >
                    Create Account
                  </button>
            </div>

            <div className="space-y-4">
              <div className="text-left">
                <h2 className="text-xl font-bold tracking-tight text-on-surface">
                  {isSignUp ? roleCopy.signUpHeading : roleCopy.signInHeading}
                </h2>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {isSignUp ? roleCopy.signUpDescription : roleCopy.signInDescription}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {isSignUp ? (
                  <div className="space-y-1">
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Full Name</label>
                    <input
                      type="text"
                      placeholder="Alex Johnson"
                      value={fullName}
                      onChange={(event) => handleFullNameChange(event.target.value)}
                      autoComplete="name"
                      disabled={isSubmitting}
                      required
                      className="w-full border border-on-surface/10 bg-surface px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                ) : null}

                <div className="space-y-1">
                  <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Email address</label>
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
                    className="w-full border border-on-surface/10 bg-surface px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1">
                  <div className="ml-1 flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                    {!isSignUp ? <span className="text-[11px] font-bold text-on-surface-variant/60">Reset soon</span> : null}
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => handlePasswordChange(event.target.value)}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    disabled={isSubmitting}
                    required
                    className="w-full border border-on-surface/10 bg-surface px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                {error || oauthError ? (
                  <p aria-live="polite" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error || oauthError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="mt-1 w-full bg-primary py-2.5 text-sm font-bold text-on-surface transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Please wait..." : isSignUp ? roleCopy.submitSignUp : roleCopy.submitSignIn}
                </button>
              </form>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-on-surface/10" />
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="bg-surface-container-lowest px-3 font-bold uppercase tracking-widest text-on-surface-variant">
                    Or continue with
                  </span>
                </div>
              </div>

              <a
                href={googleAuthHref}
                className="flex w-full items-center justify-center gap-2 border border-on-surface/10 bg-surface px-3 py-2.5 text-sm font-bold text-on-surface transition-colors duration-200 hover:bg-surface-container"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </a>

              <p className="text-center text-[11px] leading-relaxed text-on-surface-variant">
                {postAuthHint} You&apos;ll continue to <span className="font-semibold text-on-surface">{postAuthDestination}</span>.
              </p>

              <p className="text-center text-xs text-on-surface-variant">
                {isSignUp ? "Already have an account?" : "Need a new account?"}{" "}
                <button
                  type="button"
                  onClick={() => updateAuthState(isSignUp ? "signin" : "signup", role)}
                  className="font-semibold text-on-surface transition-colors hover:text-primary"
                >
                  {isSignUp ? "Sign in instead" : "Create one here"}
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
