import { Role } from "@/data/mockUsers";
import { ROLE_LABELS, ROLE_COLORS } from "@/utils/permissions";

export const RoleBadge = ({ role }: { role: Role }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[role]}`}>
    {ROLE_LABELS[role]}
  </span>
);
