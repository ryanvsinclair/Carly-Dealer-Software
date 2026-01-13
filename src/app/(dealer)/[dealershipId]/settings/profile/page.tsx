import { requirePermission } from '@/lib/dealer/requirePermission';

export default async function ProfileSettingsPage({
  params,
}: {
  params: { dealershipId: string };
}) {
  await requirePermission(params.dealershipId, 'dealership.edit');

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
      <p className="text-sm font-light text-muted-foreground">
        Manage your user profile and preferences
      </p>
    </div>
  );
}
