"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DealerInviteTestPage() {
  const [token, setToken] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token || token.includes("/")) {
      alert("Invalid token");
      return;
    }

    // 🔑 IMPORTANT: encode the token
    const params = new URLSearchParams({ token });
    router.push(`/dealer-invite?${params.toString()}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A] p-6">
      <Card className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-xl font-bold">Internal Invite Test</h1>

        <p className="text-sm text-muted-foreground">
          Paste a dealer invite token to continue the real invite flow.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Invite token (UUID)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
}
