import { requirePermission } from '@/lib/dealer/requirePermission';

export default async function DealershipSettingsPage({
  params,
}: {
  params: { dealershipId: string };
}) {
  await requirePermission(params.dealershipId, 'dealership:edit');

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dealership Settings</h2>
      <p className="text-sm font-light text-muted-foreground">
        Configure dealership details and preferences
      </p>
    </div>
  );
}
