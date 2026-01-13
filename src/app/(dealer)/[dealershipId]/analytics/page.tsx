import { requirePermission } from '@/lib/dealer/requirePermission';

export default async function AnalyticsPage({
  params,
}: {
  params: { dealershipId: string };
}) {
  await requirePermission(params.dealershipId, 'analytics.view');

  return (
    <div className="p-6 lg:p-12">
      <h1 className="text-[28px] font-bold leading-tight tracking-tight">
        Analytics
      </h1>
      <p className="mt-2 text-sm font-light text-muted-foreground">
        Charts and tables for sales performance, inventory turnover, lead
        conversion, and revenue metrics
      </p>
    </div>
  );
}
