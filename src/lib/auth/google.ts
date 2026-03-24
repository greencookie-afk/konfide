import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { createSignedToken, setSessionCookie, verifySignedToken } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { getPathForRole } from "@/lib/auth/server";
import { Prisma } from "@/generated/prisma/client";
import type { UserRole } from "@/generated/prisma/client";

const GOOGLE_AUTHORIZATION_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";

type GoogleAuthMode = "signin" | "signup";
type GoogleAuthRole = "talk" | "listen";

type GoogleUserInfo = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

type GoogleStatePayload = {
  nonce: string;
  role: GoogleAuthRole;
  mode: GoogleAuthMode;
  codeVerifier: string;
  exp: number;
};

function getGoogleClientId() {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not configured.");
  }

  return clientId;
}

function getGoogleClientSecret() {
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientSecret) {
    throw new Error("GOOGLE_CLIENT_SECRET is not configured.");
  }

  return clientSecret;
}

function parseRole(role: GoogleAuthRole): UserRole {
  return role === "listen" ? "LISTENER" : "TALKER";
}

function readRequestedRole(value: string | null): GoogleAuthRole {
  return value === "listen" ? "listen" : "talk";
}

function readRequestedMode(value: string | null): GoogleAuthMode {
  return value === "signup" ? "signup" : "signin";
}

function createCodeVerifier() {
  return randomBytes(32).toString("base64url");
}

function createCodeChallenge(codeVerifier: string) {
  return createHash("sha256").update(codeVerifier).digest("base64url");
}

function getPostAuthPath(role: UserRole, mode: GoogleAuthMode) {
  if (role === "LISTENER") {
    return mode === "signup" ? "/join/apply" : "/listener/dashboard";
  }

  return getPathForRole(role);
}

function getBaseUrl(request: Request) {
  const url = new URL(request.url);
  return url.origin;
}

function getCallbackUrl(request: Request) {
  return `${getBaseUrl(request)}/api/auth/google/callback`;
}

function readGoogleState(state: string | null) {
  const payload = verifySignedToken<GoogleStatePayload>(state || undefined);

  if (
    !payload ||
    typeof payload.nonce !== "string" ||
    typeof payload.codeVerifier !== "string" ||
    payload.codeVerifier.length < 43 ||
    (payload.role !== "talk" && payload.role !== "listen") ||
    (payload.mode !== "signin" && payload.mode !== "signup")
  ) {
    return null;
  }

  return payload;
}

function getAuthErrorRedirect(
  request: Request,
  role: GoogleAuthRole,
  mode: GoogleAuthMode,
  error: string,
  details?: string
) {
  const url = new URL("/auth", getBaseUrl(request));
  url.searchParams.set("role", role);
  url.searchParams.set("mode", mode);
  url.searchParams.set("error", error);

  if (details && process.env.NODE_ENV !== "production") {
    url.searchParams.set("details", details.slice(0, 220));
  }

  return url;
}

export async function startGoogleAuth(request: Request) {
  const url = new URL(request.url);
  const role = readRequestedRole(url.searchParams.get("role"));
  const mode = readRequestedMode(url.searchParams.get("mode"));
  const codeVerifier = createCodeVerifier();
  const state = createSignedToken(
    {
      nonce: randomBytes(24).toString("base64url"),
      role,
      mode,
      codeVerifier,
    },
    60 * 10
  );
  const authorizationUrl = new URL(GOOGLE_AUTHORIZATION_ENDPOINT);

  authorizationUrl.searchParams.set("client_id", getGoogleClientId());
  authorizationUrl.searchParams.set("redirect_uri", getCallbackUrl(request));
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid email profile");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("code_challenge", createCodeChallenge(codeVerifier));
  authorizationUrl.searchParams.set("code_challenge_method", "S256");
  authorizationUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authorizationUrl, {
    headers: {
      "Cache-Control": "no-store",
    },
  });

  return response;
}

async function readErrorDetails(response: Response) {
  const message = await response.text();
  return message ? message.slice(0, 400) : response.statusText;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

function isSchemaMismatchError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2021" || error.code === "P2022")
  );
}

async function exchangeGoogleCode(request: Request, code: string, codeVerifier: string) {
  const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: getGoogleClientId(),
      client_secret: getGoogleClientSecret(),
      redirect_uri: getCallbackUrl(request),
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Failed to exchange the Google authorization code: ${await readErrorDetails(tokenResponse)}`);
  }

  return (await tokenResponse.json()) as {
    access_token: string;
    token_type: string;
  };
}

async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve the Google user profile: ${await readErrorDetails(response)}`);
  }

  return (await response.json()) as GoogleUserInfo;
}

export async function finishGoogleAuth(request: Request) {
  const url = new URL(request.url);
  const statePayload = readGoogleState(url.searchParams.get("state"));

  if (!statePayload) {
    return NextResponse.redirect(getAuthErrorRedirect(request, "talk", "signin", "google_session_expired"));
  }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      getAuthErrorRedirect(request, statePayload.role, statePayload.mode, "google_access_denied"),
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!code) {
    return NextResponse.redirect(
      getAuthErrorRedirect(request, statePayload.role, statePayload.mode, "google_invalid_callback"),
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const token = await exchangeGoogleCode(request, code, statePayload.codeVerifier);
    const profile = await fetchGoogleUserInfo(token.access_token);

    if (!profile.sub || !profile.email || profile.email_verified !== true) {
      throw new Error("Google did not return a verified email address.");
    }

    const intendedRole = parseRole(statePayload.role);
    let user = await prisma.user.findUnique({
      where: {
        googleSubject: profile.sub,
      },
    });

    if (!user) {
      const emailMatch = await prisma.user.findUnique({
        where: {
          email: profile.email.toLowerCase(),
        },
      });

      if (emailMatch) {
        if (emailMatch.role !== intendedRole) {
          return NextResponse.redirect(
            getAuthErrorRedirect(request, statePayload.role, statePayload.mode, "google_role_mismatch"),
            { headers: { "Cache-Control": "no-store" } }
          );
        }

        if (emailMatch.googleSubject && emailMatch.googleSubject !== profile.sub) {
          return NextResponse.redirect(
            getAuthErrorRedirect(request, statePayload.role, statePayload.mode, "google_email_in_use"),
            { headers: { "Cache-Control": "no-store" } }
          );
        }

        user = await prisma.user.update({
          where: {
            id: emailMatch.id,
          },
          data: {
            googleSubject: profile.sub,
            emailVerified: true,
            avatarUrl: profile.picture || emailMatch.avatarUrl,
            name: emailMatch.name || profile.name || null,
          },
        });
      } else {
        if (statePayload.mode === "signin") {
          return NextResponse.redirect(
            getAuthErrorRedirect(request, statePayload.role, statePayload.mode, "google_account_not_found"),
            { headers: { "Cache-Control": "no-store" } }
          );
        }

        user = await prisma.user.create({
          data: {
            email: profile.email.toLowerCase(),
            emailVerified: true,
            googleSubject: profile.sub,
            name: profile.name || null,
            avatarUrl: profile.picture || null,
            role: intendedRole,
          },
        });
      }
    }

    if (user.role !== intendedRole) {
      return NextResponse.redirect(
        getAuthErrorRedirect(request, statePayload.role, statePayload.mode, "google_role_mismatch"),
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const response = NextResponse.redirect(new URL(getPostAuthPath(user.role, statePayload.mode), getBaseUrl(request)), {
      headers: {
        "Cache-Control": "no-store",
      },
    });

    setSessionCookie(response, {
      userId: user.id,
      role: user.role,
    });
    return response;
  } catch (error) {
    console.error("Google auth callback failed:", error);

    if (isSchemaMismatchError(error)) {
      return NextResponse.redirect(
        getAuthErrorRedirect(request, statePayload.role, statePayload.mode, "auth_schema_outdated"),
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.redirect(
      getAuthErrorRedirect(
        request,
        statePayload.role,
        statePayload.mode,
        "google_auth_failed",
        getErrorMessage(error)
      ),
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
