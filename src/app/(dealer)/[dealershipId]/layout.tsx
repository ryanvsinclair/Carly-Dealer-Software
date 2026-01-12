import { getDealerContext } from '@/lib/dealer/getDealerContext';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

export default async function DealerTenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { dealershipId: string };
}) {
  // Tenant enforcement
  let context;
  try {
    context = await getDealerContext(params.dealershipId);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '';
    
    // No user authenticated
    if (errorMessage.includes('Not authenticated')) {
      redirect('/dealer-login');
    }
    
    // No membership or inactive
    if (errorMessage.includes('Unauthorized')) {
      redirect('/dealer-request-access');
    }
    
    // Unknown error
    redirect('/dealer-login');
  }

  const { dealership } = context;

  // Account suspended state
  if (dealership.account_status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-card border border-border rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-3">Account Suspended</h1>
            <p className="text-muted-foreground font-light mb-6">
              This dealership account has been suspended. Please contact support for assistance.
            </p>
            <div className="text-sm text-muted-foreground">
              Dealership: <span className="font-medium">{dealership.name}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Valid tenant - render full shell
  return (
    <div className="min-h-screen flex">
      <Sidebar 
        dealershipId={dealership.id}
        dealershipName={dealership.name}
        logoUrl={dealership.logo_url}
        roleLabel={context.membership.role.replace('_', ' ')}
        permissions={context.permissions}
      />
      <div className="flex-1 flex flex-col lg:pl-60">
        <Header 
          dealershipId={dealership.id}
          dealershipName={dealership.name}
          logoUrl={dealership.logo_url}
          roleLabel={context.membership.role.replace('_', ' ')}
          permissions={context.permissions}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
