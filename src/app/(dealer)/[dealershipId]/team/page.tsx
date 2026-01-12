import { getDealerContext } from '@/lib/dealer/getDealerContext';
import { requirePermission } from '@/lib/dealer/requirePermission';
import { createSupabaseServer } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { InviteStaffModal } from './InviteStaffModal';
import { InvitesList } from './InvitesList';
import { can, type DealerRole } from '@/lib/rbac';

export default async function DealerTeamPage({
  params,
}: {
  params: { dealershipId: string };
}) {
  await requirePermission(params.dealershipId, 'team:view');
  
  const { dealership, currentUserId, currentUserRole } = await getDealerContext(params.dealershipId);
  const supabase = createSupabaseServer();
  
  const canInvite = can(currentUserRole as DealerRole, 'invite:create');
  const canManageTeam = can(currentUserRole as DealerRole, 'team:manage');

  const { data: team } = await supabase.rpc('get_dealer_team', {
    p_dealership_id: params.dealershipId,
  });

  const { data: invites } = await supabase
    .from('dealer_invitations')
    .select('id, email, role, status, created_at, expires_at')
    .eq('dealership_id', params.dealershipId)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#171717] dark:text-[#FAFAFA]">
          Team — {dealership.name}
        </h1>
        {canInvite && (
          <InviteStaffModal 
            dealershipId={params.dealershipId}
            currentUserId={currentUserId}
          />
        )}
      </div>

      <div className="border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#171717] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#E5E5E5] dark:border-[#262626]">
              <TableHead className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                Role
              </TableHead>
              <TableHead className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                Status
              </TableHead>
              {canManageTeam && (
                <TableHead className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {team?.map((member) => (
              <TableRow
                key={member.membership_id}
                className="border-b border-[#E5E5E5] dark:border-[#262626]"
              >
                <TableCell className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA]">
                  {member.name ?? 'N/A'}
                </TableCell>
                <TableCell className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA]">
                  {member.email ?? 'N/A'}
                </TableCell>
                <TableCell className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA]">
                  {member.role}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={member.is_active ? 'default' : 'secondary'}
                    className={
                      member.is_active
                        ? 'bg-[#3B82F6] text-white'
                        : 'bg-[#E5E5E5] dark:bg-[#262626] text-[#171717] dark:text-[#FAFAFA]'
                    }
                  >
                    {member.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                {canManageTeam && (
                  <TableCell>
                    {member.user_id !== currentUserId && (
                      <form action={`/api/team/${member.membership_id}/toggle-status`} method="POST">
                        <button
                          type="submit"
                          className="text-[14px] font-light text-[#3B82F6] hover:underline"
                        >
                          {member.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </form>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {canInvite && (
        <InvitesList 
          invites={invites || []}
          dealershipId={params.dealershipId}
        />
      )}
    </div>
  );
}
