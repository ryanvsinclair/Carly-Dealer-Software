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

type DealerTeamRow = {
  user_id: string;
  email: string;
  role: string;
  is_active: boolean;
  member_created_at: string;
  invite_id: string;
  invite_email: string;
  invite_role: string;
  invite_status: string;
  invite_created_at: string;
};

export default async function DealerTeamPage({
  params,
}: {
  params: { dealershipId: string };
}) {
  await requirePermission(params.dealershipId, 'team.view');

  const context = await getDealerContext(params.dealershipId);
  const supabase = createSupabaseServer();

  const currentUserId = context.user.id;

  const canInvite = context.permissions.includes('invite.create');
  const canManageTeam = context.permissions.includes('team.manage');

  type GetDealerTeamArgs = {
    p_dealership_id: string;
  };

  const { data: team } = await supabase.rpc(
    'get_dealer_team',
    { p_dealership_id: params.dealershipId }
  );

  const { data: invites } = await supabase
    .from('dealer_invitations')
    .select('id, email, role, status, created_at, expires_at')
    .eq('dealership_id', params.dealershipId)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#171717] dark:text-[#FAFAFA]">
          Team — {context.dealership.name}
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
                Email
              </TableHead>
              <TableHead className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                Role
              </TableHead>
              <TableHead className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team?.map((member) => (
              <TableRow
                key={member.user_id}
                className="border-b border-[#E5E5E5] dark:border-[#262626]"
              >
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
