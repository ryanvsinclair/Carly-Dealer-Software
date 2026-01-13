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

/**
 * Server-side permission check (non-throwing)
 * Useful for conditional UI (buttons, actions, etc.)
 */
export async function hasPermission(
  dealershipId: string,
  permission: DealerPermission
): Promise<boolean> {
  const context = await getDealerContext(dealershipId);
  return context.permissions.includes(permission);
}
