import { requirePermission } from '@/lib/dealer/requirePermission';

export default async function IntegrationsSettingsPage({
  params,
}: {
  params: { dealershipId: string };
}) {
  await requirePermission(params.dealershipId, 'dealership.edit');

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Integrations</h2>
      <p className="text-sm font-light text-muted-foreground">
        Configure third-party integrations and API connections
      </p>
    </div>
  );
}
