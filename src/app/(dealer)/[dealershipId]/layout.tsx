import { getDealerContext } from '@/lib/dealer/getDealerContext';

export default async function DealerTenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { dealershipId: string };
}) {
  const { dealership } = await getDealerContext(params.dealershipId);

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r p-4">
        <div className="font-bold">{dealership.name}</div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
