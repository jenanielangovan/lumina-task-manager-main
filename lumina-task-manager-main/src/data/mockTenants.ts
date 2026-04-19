export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: "Starter" | "Pro" | "Enterprise";
  members: number;
  color: string;
  createdAt: string;
  status: "active" | "suspended";
}

export const MOCK_TENANTS: Tenant[] = [
  { id: "tenant_1", name: "TechCorp", slug: "techcorp", plan: "Pro", members: 4, color: "#7C3AED", createdAt: "2024-01-15", status: "active" },
  { id: "tenant_2", name: "InnovateCo", slug: "innovate", plan: "Starter", members: 2, color: "#06B6D4", createdAt: "2024-01-20", status: "active" },
];
