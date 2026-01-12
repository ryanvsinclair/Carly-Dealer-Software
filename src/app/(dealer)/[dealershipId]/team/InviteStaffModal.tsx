'use client';

import { useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface InviteStaffModalProps {
  dealershipId: string;
  currentUserId: string;
}

export function InviteStaffModal({
  dealershipId,
  currentUserId,
}: InviteStaffModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('');

  const generateToken = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInviteLink(null);

    try {
      const supabase = createSupabaseBrowser();
      const token = generateToken();

      const { error: insertError } = await supabase
        .from('dealer_invitations')
        .insert({
          dealership_id: dealershipId,
          email: email.trim(),
          role,
          token,
          invited_by: currentUserId,
        });

      if (insertError) throw insertError;

      const link = `${window.location.origin}/dealer-invite?token=${token}`;
      setInviteLink(link);
      setEmail('');
      setRole('');
    } catch (err: any) {
      setError(err.message || 'Failed to create invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setInviteLink(null);
    setError(null);
    setEmail('');
    setRole('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Invite Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-[#171717] border-[#E5E5E5] dark:border-[#262626]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#171717] dark:text-[#FAFAFA]">
            Invite Staff Member
          </DialogTitle>
        </DialogHeader>

        {!inviteLink ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA]"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="staff@example.com"
                className="border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#0A0A0A] text-[#171717] dark:text-[#FAFAFA]"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA]"
              >
                Role
              </Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#0A0A0A] text-[#171717] dark:text-[#FAFAFA]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#171717] border-[#E5E5E5] dark:border-[#262626]">
                  <SelectItem value="general_manager">General Manager</SelectItem>
                  <SelectItem value="sales_manager">Sales Manager</SelectItem>
                  <SelectItem value="finance_manager">Finance Manager</SelectItem>
                  <SelectItem value="salesperson">Salesperson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <p className="text-[14px] text-red-500 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-[#E5E5E5] dark:border-[#262626]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !email || !role}
                className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"
              >
                {loading ? 'Creating...' : 'Create Invite'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA]">
                Invite Link Created
              </Label>
              <div className="p-4 bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] rounded-lg">
                <p className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA] break-all">
                  {inviteLink}
                </p>
              </div>
              <p className="text-[12px] text-[#171717]/60 dark:text-[#FAFAFA]/60">
                Share this link with {email}. The link expires in 7 days.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleClose}
                className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
