import { notFound } from "next/navigation";
import { getDealerContext } from "./getDealerContext";
import type { DealerPermission } from "@/lib/rbac";

/**
 * Server-side permission guard
 * Blocks access if user lacks required permission
 */
export async function requirePermission(
  dealershipId: string,
  permission: DealerPermission
): Promise<void> {
  const context = await getDealerContext(dealershipId);
  
  if (!context.permissions.includes(permission)) {
    notFound();
  }
}
