export type Role = "super_admin" | "tenant_admin" | "project_manager" | "team_member" | "viewer";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  tenantId: string | null;
  avatar?: string;
  bio?: string;
  joinedAt: string;
}

export const MOCK_USERS: MockUser[] = [
  { id: "1", name: "Alice Super", email: "superadmin@lumina.com", password: "super123", role: "super_admin", tenantId: null, bio: "Platform administrator", joinedAt: "2024-01-01" },
  { id: "2", name: "Bob TechCorp", email: "admin@techcorp.com", password: "admin123", role: "tenant_admin", tenantId: "tenant_1", bio: "TechCorp admin", joinedAt: "2024-02-15" },
  { id: "3", name: "Carol Dev", email: "pm@techcorp.com", password: "pm123", role: "project_manager", tenantId: "tenant_1", bio: "Project manager at TechCorp", joinedAt: "2024-03-01" },
  { id: "4", name: "Dave Worker", email: "member@techcorp.com", password: "member123", role: "team_member", tenantId: "tenant_1", bio: "Frontend developer", joinedAt: "2024-03-15" },
  { id: "5", name: "Eve Viewer", email: "viewer@techcorp.com", password: "viewer123", role: "viewer", tenantId: "tenant_1", bio: "Stakeholder", joinedAt: "2024-04-01" },
  { id: "6", name: "Frank InnovateCo", email: "admin@innovate.com", password: "admin123", role: "tenant_admin", tenantId: "tenant_2", bio: "InnovateCo founder", joinedAt: "2024-01-20" },
  { id: "7", name: "Grace Dev", email: "member@innovate.com", password: "member123", role: "team_member", tenantId: "tenant_2", bio: "Full-stack developer", joinedAt: "2024-02-10" },
];
