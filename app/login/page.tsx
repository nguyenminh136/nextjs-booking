"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-95 shadow-lg rounded-2xl border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-800">
            Sign in to your account
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={() =>
              signIn("auth0", { callbackUrl: "/dashboard" })
            }
          >
            Log in
          </Button>

          <Button
            variant="default"
            onClick={() =>
              signIn("google", { callbackUrl: "/dashboard" })
            }
          >
            Continue with Google
          </Button>

          <p className="text-sm text-center text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <span
              onClick={() =>
                signIn("auth0", {
                  callbackUrl: "/dashboard",
                  authorizationParams: {
                    screen_hint: "signup",
                  },
                })
              }
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Sign up here
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
