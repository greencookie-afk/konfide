import { finishGoogleAuth } from "@/server/auth/google";

export async function GET(request: Request) {
  return finishGoogleAuth(request);
}
