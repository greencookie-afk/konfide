import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/shared/Navbar";
import { redirectAuthenticatedUser } from "@/server/auth/server";

type AuthPageSearchParams = Promise<{
  mode?: string | string[];
  role?: string | string[];
  error?: string | string[];
  details?: string | string[];
}>;

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: AuthPageSearchParams;
}) {
  await redirectAuthenticatedUser();
  const params = await searchParams;
  const mode = readParam(params.mode) === "signup" ? "signup" : "signin";
  const role = readParam(params.role) === "listen" ? "listen" : "talk";
  const error = readParam(params.error) || "";
  const details = readParam(params.details) || "";

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <Navbar />
      <AuthForm initialMode={mode} initialRole={role} initialError={error} initialDetails={details} />
    </div>
  );
}
