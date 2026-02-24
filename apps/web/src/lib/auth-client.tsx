"use client";

import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { AuthBoundary } from "@convex-dev/better-auth/react";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { isAuthError } from "@/lib/utils";
import { api } from "@aqoon-ai/backend/convex/_generated/api";

export const authClient = createAuthClient({
  plugins: [convexClient()],
});

export const ClientAuthBoundary = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  return (
    <AuthBoundary
      authClient={authClient}
      onUnauth={() => router.push("/signin")}
      getAuthUserFn={api.auth.getAuthUser}
      isAuthError={isAuthError}
    >
      {children}
    </AuthBoundary>
  );
};
