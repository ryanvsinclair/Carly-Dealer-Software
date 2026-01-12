import { getDealerContext } from '@/lib/dealer/getDealerContext';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export default async function DealerHomePage({
  params,
}: {
  params: { dealershipId: string };
}) {
  const { dealership } = await getDealerContext(params.dealershipId);
  const supabase = createSupabaseServer();

  // Query vehicles count
  const { count: totalVehicles } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .eq('owner_type', 'dealer')
    .eq('owner_dealership_id', params.dealershipId);

  const { count: publishedVehicles } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .eq('owner_type', 'dealer')
    .eq('owner_dealership_id', params.dealershipId)
    .eq('publish_status', 'published');

  const { count: draftVehicles } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .eq('owner_type', 'dealer')
    .eq('owner_dealership_id', params.dealershipId)
    .eq('publish_status', 'draft');

  // Placeholder for leads
  const leadsCount = 0;

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-[28px] font-bold text-[#171717] dark:text-[#FAFAFA]">
          {dealership.name}
        </h1>
        <p className="text-[16px] font-light text-[#171717]/60 dark:text-[#FAFAFA]/60">
          Dealer Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-8 border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#171717]">
          <div className="space-y-3">
            <p className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
              Total Vehicles
            </p>
            <p className="text-[28px] font-bold text-[#171717] dark:text-[#FAFAFA]">
              {totalVehicles ?? 0}
            </p>
          </div>
        </Card>

        <Card className="p-8 border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#171717]">
          <div className="space-y-3">
            <p className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
              Published
            </p>
            <p className="text-[28px] font-bold text-[#171717] dark:text-[#FAFAFA]">
              {publishedVehicles ?? 0}
            </p>
          </div>
        </Card>

        <Card className="p-8 border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#171717]">
          <div className="space-y-3">
            <p className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
              Drafts
            </p>
            <p className="text-[28px] font-bold text-[#171717] dark:text-[#FAFAFA]">
              {draftVehicles ?? 0}
            </p>
          </div>
        </Card>

        <Card className="p-8 border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#171717]">
          <div className="space-y-3">
            <p className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
              Leads
            </p>
            <p className="text-[28px] font-bold text-[#171717] dark:text-[#FAFAFA]">
              {leadsCount}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
