import { requirePermission } from '@/lib/dealer/requirePermission';

export default async function TeamSettingsPage({
  params,
}: {
  params: { dealershipId: string };
}) {
  await requirePermission(params.dealershipId, 'dealership.edit');

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Team Management</h2>
      <p className="text-sm font-light text-muted-foreground">
        Manage team members, roles, and permissions
      </p>
    </div>
  );
}
