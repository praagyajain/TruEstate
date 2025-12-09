import { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  FileText,
  Package,
  Shield,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  FileCheck,
  FileX,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Sidebar = () => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  return (
    <div className="w-64 bg-sidebar h-screen flex flex-col border-r border-sidebar-border overflow-y-auto">
      
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
            V
          </div>
          <div>
            <p className="text-sidebar-foreground font-semibold text-sm">
              Vault
            </p>
            <p className="text-sidebar-foreground text-xs opacity-75">
              Anoop Yadav
            </p>
          </div>
        </div>
      </div>

      
      <nav className="flex-1 px-3 py-4 space-y-2">
        
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-foreground hover:bg-opacity-80 transition"
        >
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </a>

        
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition"
        >
          <Package size={18} />
          <span className="text-sm font-medium">Nexus</span>
        </a>

        
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition"
        >
          <FileText size={18} />
          <span className="text-sm font-medium">Intake</span>
        </a>

        
        <div>
          <button
            onClick={() => toggleMenu("services")}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition"
          >
            <div className="flex items-center gap-3">
              <Settings size={18} />
              <span className="text-sm font-medium">Services</span>
            </div>
            {expandedMenu === "services" ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {expandedMenu === "services" && (
            <div className="ml-6 space-y-1 mt-1">
              <a
                href="#"
                className="block px-3 py-2 rounded text-sidebar-foreground text-sm hover:bg-sidebar-accent transition"
              >
                Pre-active
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded text-sidebar-foreground text-sm hover:bg-sidebar-accent transition"
              >
                Active
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded text-sidebar-foreground text-sm hover:bg-sidebar-accent transition"
              >
                Blocked
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded text-sidebar-foreground text-sm hover:bg-sidebar-accent transition"
              >
                Closed
              </a>
            </div>
          )}
        </div>

        
        <div>
          <button
            onClick={() => toggleMenu("invoices")}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition"
          >
            <div className="flex items-center gap-3">
              <CreditCard size={18} />
              <span className="text-sm font-medium">Invoices</span>
            </div>
            {expandedMenu === "invoices" ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {expandedMenu === "invoices" && (
            <div className="ml-6 space-y-1 mt-1">
              <a
                href="#"
                className="block px-3 py-2 rounded text-sidebar-foreground text-sm hover:bg-sidebar-accent transition"
              >
                Preforma Invoices
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded text-sidebar-foreground text-sm hover:bg-sidebar-accent transition"
              >
                Final Invoices
              </a>
            </div>
          )}
        </div>

        
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition"
        >
          <Shield size={18} />
          <span className="text-sm font-medium">Security</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition"
        >
          <Users size={18} />
          <span className="text-sm font-medium">Users</span>
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
