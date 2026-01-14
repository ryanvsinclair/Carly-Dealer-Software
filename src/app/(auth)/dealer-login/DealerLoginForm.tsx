'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface DealerLoginFormProps {
  next?: string;
  status?: string;
  invite?: string;
}

export function DealerLoginForm({ next, status, invite }: DealerLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // If there's a next param (e.g., from invite flow), redirect there
        if (next) {
          router.push(next);
        } else if (invite) {
          // Legacy invite param support
          router.push(`/dealer-invite/${invite}`);
        } else {
          // Redirect to dealer gateway - it will handle dealership selection
          router.push('/dealer');
        }
        router.refresh(); // Force Next.js to rehydrate auth state
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <Card className="w-full max-w-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Dealer Login</CardTitle>
          <CardDescription className="text-sm text-neutral-600 dark:text-neutral-400">
            Sign in to your dealership workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@dealership.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="border-neutral-200 dark:border-neutral-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="border-neutral-200 dark:border-neutral-800"
              />
            </div>
            {status === 'invite-required' && (
              <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-600 dark:text-yellow-400">
                You don't belong to any dealership yet.  
                Ask a dealership manager to invite you.
              </div>
            )}
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-neutral-200 dark:border-neutral-800 pt-6">
          <div className="flex flex-col space-y-2 text-center text-sm">
            <p className="text-neutral-600 dark:text-neutral-400">
              Got an invite?{' '}
              <Link
                href="/dealer-invite"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Accept Invite
              </Link>
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Don't have access?{' '}
              <Link
                href="/dealer-request-access"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Apply here
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
