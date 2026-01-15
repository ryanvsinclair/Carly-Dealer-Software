'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DealerInviteTestPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) return alert('Missing token');

    const params = new URLSearchParams({ token });
    router.push(`/dealer-invite?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} style={{ padding: 40 }}>
      <h1>Internal Invite Test</h1>

      <input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Invite token"
        style={{ width: '100%', padding: 8, marginTop: 12 }}
      />

      <button type="submit" style={{ marginTop: 12 }}>
        Continue
      </button>
    </form>
  );
}
