import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Building2 } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { formatDate } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";
import type { Tenant } from "@/data/mockTenants";

const TenantsPage = () => {
  const { tenants, addTenant } = useTenant();
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<Tenant["plan"]>("Starter");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addTenant({
      id: `tenant_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      plan,
      members: 0,
      color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
    });
    setShowCreate(false);
    setName("");
    toast({ title: "Tenant created!" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium glow-btn">
          <Plus className="w-4 h-4" /> Create Tenant
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Members</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id} className="border-b border-border/50">
                <td className="px-4 py-3 font-medium flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                  {t.name}
                </td>
                <td className="px-4 py-3">{t.plan}</td>
                <td className="px-4 py-3">{t.members}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(t.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-destructive/20 text-destructive"}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-xs text-primary hover:underline mr-3">View</button>
                  <button className="text-xs text-destructive hover:underline">Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="glass-card p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">Create Tenant</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tenant name" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
              <select value={plan} onChange={(e) => setPlan(e.target.value as Tenant["plan"])} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="Starter">Starter</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg text-sm border border-input hover:bg-accent">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground glow-btn">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TenantsPage;
