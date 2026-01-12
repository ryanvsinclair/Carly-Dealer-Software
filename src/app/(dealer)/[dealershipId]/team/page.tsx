import { getDealerContext } from '@/lib/dealer/getDealerContext';
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

export default async function DealerTeamPage({
  params,
}: {
  params: { dealershipId: string };
}) {
  const { dealership, currentUserId } = await getDealerContext(params.dealershipId);
  const supabase = createSupabaseServer();

  const { data: team } = await supabase
    .from('dealer_memberships')
    .select(`
      id,
      role,
      is_active,
      profiles (
        id,
        name,
        email,
        phone_number
      )
    `)
    .eq('dealership_id', params.dealershipId);

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
        <InviteStaffModal 
          dealershipId={params.dealershipId}
          currentUserId={currentUserId}
        />
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {team?.map((member: any) => (
              <TableRow
                key={member.id}
                className="border-b border-[#E5E5E5] dark:border-[#262626]"
              >
                <TableCell className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA]">
                  {member.profiles?.name ?? 'N/A'}
                </TableCell>
                <TableCell className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA]">
                  {member.profiles?.email ?? 'N/A'}
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

      <InvitesList 
        invites={invites || []}
        dealershipId={params.dealershipId}
      />
    </div>
  );
}
