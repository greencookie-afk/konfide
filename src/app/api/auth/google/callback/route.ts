import { finishGoogleAuth } from "@/lib/auth/google";

export async function GET(request: Request) {
  return finishGoogleAuth(request);
}
