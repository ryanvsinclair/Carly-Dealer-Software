'use client';

import { useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Invite {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  expires_at: string;
}

interface InvitesListProps {
  invites: Invite[];
  dealershipId: string;
}

export function InvitesList({ invites: initialInvites, dealershipId }: InvitesListProps) {
  const [invites, setInvites] = useState(initialInvites);
  const [loading, setLoading] = useState<string | null>(null);

  const handleRevoke = async (inviteId: string) => {
    setLoading(inviteId);
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase
        .from('dealer_invitations')
        .update({ status: 'revoked' })
        .eq('id', inviteId);

      if (error) throw error;

      setInvites((prev) =>
        prev.map((inv) =>
          inv.id === inviteId ? { ...inv, status: 'revoked' } : inv
        )
      );
    } catch (err) {
      console.error('Failed to revoke invite:', err);
    } finally {
      setLoading(null);
    }
  };

  if (invites.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-[20px] font-bold text-[#171717] dark:text-[#FAFAFA]">
        Pending Invitations
      </h2>
      <div className="border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#171717] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#E5E5E5] dark:border-[#262626]">
              <TableHead className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                Role
              </TableHead>
              <TableHead className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                Expires
              </TableHead>
              <TableHead className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((invite) => {
              const expiresAt = new Date(invite.expires_at);
              const isExpired = expiresAt < new Date();
              
              return (
                <TableRow
                  key={invite.id}
                  className="border-b border-[#E5E5E5] dark:border-[#262626]"
                >
                  <TableCell className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA]">
                    {invite.email}
                  </TableCell>
                  <TableCell className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA]">
                    {invite.role}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        invite.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
                          : invite.status === 'accepted'
                          ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
                          : 'bg-[#E5E5E5] dark:bg-[#262626] text-[#171717] dark:text-[#FAFAFA]'
                      }
                      variant="outline"
                    >
                      {isExpired && invite.status === 'pending' ? 'Expired' : invite.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA]">
                    {expiresAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {invite.status === 'pending' && !isExpired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(invite.id)}
                        disabled={loading === invite.id}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        {loading === invite.id ? 'Revoking...' : 'Revoke'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
