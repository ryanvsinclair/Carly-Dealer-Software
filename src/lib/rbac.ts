/**
 * RBAC (Role-Based Access Control) Source of Truth
 *
 * This file defines the authoritative Role → Permission map for Carly Dealer.
 * Used by: Team management, Invitations, Settings, Billing, Middleware, Guards
 */

// ============================================================================
// TYPES
// ============================================================================

export type DealerRole =
  | "general_manager"
  | "sales_manager"
  | "finance_manager"
  | "salesperson";

export type DealerPermission =
  | "invite:create"
  | "invite:revoke"
  | "team:view"
  | "team:manage"
  | "dealership:edit"
  | "inventory:write"
  | "can_publish_inventory"
  | "analytics:view";

/**
 * Safe role list for UI selects (stable order, no function call)
 */
export const DEALER_ROLE_VALUES: DealerRole[] = [
  "general_manager",
  "sales_manager",
  "finance_manager",
  "salesperson",
];

// ============================================================================
// PERMISSIONS BY ROLE
// ============================================================================

export const permissionsByRole: Record<DealerRole, DealerPermission[]> = {
  general_manager: [
    "invite:create",
    "invite:revoke",
    "team:view",
    "team:manage",
    "dealership:edit",
    "inventory:write",
    "can_publish_inventory",
    "analytics:view",
  ],

  sales_manager: [
    "invite:create",
    "invite:revoke",
    "team:view",
    "team:manage",
    "inventory:write",
    "can_publish_inventory",
    "analytics:view",
  ],

  finance_manager: ["team:view", "inventory:write", "analytics:view"],

  salesperson: ["team:view", "inventory:write"],
};

// ============================================================================
// ROLE DEFINITIONS
// ============================================================================

export const DEALER_ROLES: Record<
  DealerRole,
  {
    label: string;
    description: string;
    permissions: DealerPermission[];
  }
> = {
  general_manager: {
    label: "General Manager",
    description: "Full access to all dealership operations and settings",
    permissions: permissionsByRole.general_manager,
  },

  sales_manager: {
    label: "Sales Manager",
    description: "Manage sales team, leads, deals, and inventory",
    permissions: permissionsByRole.sales_manager,
  },

  finance_manager: {
    label: "Finance Manager",
    description: "Manage deals, approvals, and financial analytics",
    permissions: permissionsByRole.finance_manager,
  },

  salesperson: {
    label: "Salesperson",
    description: "Manage own leads, deals, and customer interactions",
    permissions: permissionsByRole.salesperson,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a role has a specific permission
 */
export function can(role: DealerRole, permission: DealerPermission): boolean {
  return permissionsByRole[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has any of the specified permissions
 */
export function canAny(
  role: DealerRole,
  permissions: DealerPermission[],
): boolean {
  return permissions.some((p) => can(role, p));
}

/**
 * Check if a role has all of the specified permissions
 */
export function canAll(
  role: DealerRole,
  permissions: DealerPermission[],
): boolean {
  return permissions.every((p) => can(role, p));
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: DealerRole): DealerPermission[] {
  return permissionsByRole[role] ?? [];
}

/**
 * Get role metadata
 */
export function getRoleInfo(role: DealerRole) {
  return {
    role,
    label: DEALER_ROLES[role].label,
    description: DEALER_ROLES[role].description,
  };
}

/**
 * Get all available roles with metadata
 */
export function getAllRoles() {
  return DEALER_ROLE_VALUES.map((role) => ({
    value: role,
    label: DEALER_ROLES[role].label,
    description: DEALER_ROLES[role].description,
  }));
}

/**
 * Type guard for untrusted role values (query params, JSON, etc.)
 */
export function isDealerRole(value: unknown): value is DealerRole {
  return (
    typeof value === "string" &&
    (DEALER_ROLE_VALUES as string[]).includes(value)
  );
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  DEALER_ROLE_VALUES,
  permissionsByRole,
  can,
  canAny,
  canAll,
  getPermissions,
  getRoleInfo,
  getAllRoles,
  isDealerRole,
};
