import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default async function DealerSelectPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/dealer-login');
  }

  const { data: memberships, error } = await supabase
    .from('dealer_memberships')
    .select(`
      dealership_id,
      dealerships (
        id,
        name,
        city,
        province_code,
        logo_url
      )
    `)
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (error || !memberships || memberships.length === 0) {
    redirect('/dealer-request-access');
  }

  if (memberships.length === 1) {
    redirect(`/dealer/${memberships[0].dealership_id}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A] px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-[28px] font-bold text-[#171717] dark:text-[#FAFAFA] mb-3">
            Select Dealership
          </h1>
          <p className="text-[14px] font-light text-[#171717]/60 dark:text-[#FAFAFA]/60">
            Choose which dealership to access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memberships.map((membership) => {
            const dealership = membership.dealerships as {
              id: string;
              name: string;
              city: string | null;
              province_code: string | null;
              logo_url: string | null;
            } | null;

            if (!dealership) return null;

            return (
              <Link
                key={membership.dealership_id}
                href={`/dealer/${dealership.id}`}
                className="block"
              >
                <Card className="p-8 border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#171717] hover:bg-[#FAFAFA] dark:hover:bg-[#1F1F1F] transition-colors duration-200 cursor-pointer">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      {dealership.logo_url ? (
                        <img
                          src={dealership.logo_url}
                          alt={dealership.name}
                          className="w-16 h-16 object-contain rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-[#F5F5F5] dark:bg-[#262626] rounded flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-[#171717]/40 dark:text-[#FAFAFA]/40" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-[16px] font-bold text-[#171717] dark:text-[#FAFAFA] mb-2">
                        {dealership.name}
                      </h2>
                      {(dealership.city || dealership.province_code) && (
                        <p className="text-[14px] font-light text-[#171717]/60 dark:text-[#FAFAFA]/60">
                          {[dealership.city, dealership.province_code]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
