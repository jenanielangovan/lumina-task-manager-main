import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_TENANTS, Tenant } from "@/data/mockTenants";
import { useAuth } from "./AuthContext";

interface TenantContextType {
  activeTenant: Tenant | null;
  tenants: Tenant[];
  setActiveTenantId: (id: string) => void;
  addTenant: (tenant: Tenant) => void;
}

const TenantContext = createContext<TenantContextType | null>(null);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === "super_admin") {
        setActiveTenantId(tenants[0]?.id ?? null);
      } else {
        setActiveTenantId(user.tenantId);
      }
    } else {
      setActiveTenantId(null);
    }
  }, [user, tenants]);

  const activeTenant = tenants.find((t) => t.id === activeTenantId) ?? null;

  const addTenant = (tenant: Tenant) => setTenants((prev) => [...prev, tenant]);

  return (
    <TenantContext.Provider value={{ activeTenant, tenants, setActiveTenantId, addTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
};
