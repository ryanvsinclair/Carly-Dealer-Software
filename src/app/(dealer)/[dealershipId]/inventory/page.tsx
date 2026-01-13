import { getDealerContext } from "@/lib/dealer/getDealerContext";
import { hasPermission } from "@/lib/dealer/requirePermission";
import { createSupabaseServer } from "@/lib/supabase/server";
import { InventoryClient } from "./InventoryClient";

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  price: number;
  publish_status: string;
  sale_status: string;
  updated_at: string;
}

export default async function InventoryPage({
  params,
}: {
  params: { dealershipId: string };
}) {
  await getDealerContext(params.dealershipId);
  const supabase = createSupabaseServer();

  const canPublish = await hasPermission(
    params.dealershipId,
    "inventory.publish"
  );

  // Call RPC to get inventory (includes drafts, tenant-isolated)
  const { data: vehicles, error } = await supabase.rpc("get_dealer_inventory", {
    p_dealership_id: params.dealershipId,
  });

  if (error) {
    console.error("Failed to load inventory:", error);
  }

  const inventory: Vehicle[] = vehicles || [];

  return (
    <InventoryClient
      dealershipId={params.dealershipId}
      initialInventory={inventory}
      canPublish={canPublish}
    />
  );
}
