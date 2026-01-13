import { requirePermission } from '@/lib/dealer/requirePermission';

export default async function SettingsPage({
  params,
}: {
  params: { dealershipId: string };
}) {
  await requirePermission(params.dealershipId, 'dealership.edit');

  return (
    <div className="p-6 lg:p-12">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <p className="text-sm font-light text-muted-foreground">
        Select a settings category from the sidebar.
      </p>
    </div>
  );
}
