"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Smartphone, Settings, Users, Database, ShieldAlert, Award, 
  TrendingUp, Save, Key, DollarSign, PlusCircle, ArrowLeft, RefreshCw, Send, Check, Eye, Lock 
} from "lucide-react";

export default function AdminPanel() {
  // Admin Login States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Configuration settings (saved in localStorage or mock state)
  const [provider, setProvider] = useState("sms-activate");
  const [apiKey, setApiKey] = useState("demo_key_catchotp_123456789");
  const [multiplier, setMultiplier] = useState("1.5");
  const [flatFee, setFlatFee] = useState("2.0");
  
  // Statuses
  const [saveStatus, setSaveStatus] = useState("");
  
  // Simulated stats
  const [systemStats, setSystemStats] = useState({
    apiBalance: 42.80, // USD on upstream provider
    totalEarnings: 8432.50, // INR
    totalOrders: 1042,
    activeUsers: 84,
  });

  // Mock users list
  const [users, setUsers] = useState([
    { id: "u101", username: "developer_dev", email: "dev@catchotp.in", balance: 150.00, registered: "2026-06-25" },
    { id: "u102", username: "rahul_singh", email: "rahul@gmail.com", balance: 45.50, registered: "2026-06-28" },
    { id: "u103", username: "cryptofreak", email: "crypto@yahoo.com", balance: 520.00, registered: "2026-06-29" },
  ]);

  // Balance adjust states
  const [selectedUser, setSelectedUser] = useState("");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustAction, setAdjustAction] = useState("add"); // add or deduct

  // Admin login handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      setIsAdminLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid Admin Password! Hint: admin123");
    }
  };

  // Settings Save Handler
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 1000);
  };

  // Adjust balance handler
  const handleAdjustBalance = (e) => {
    e.preventDefault();
    if (!selectedUser || !adjustAmount || isNaN(adjustAmount) || Number(adjustAmount) <= 0) {
      alert("Please fill all details correctly.");
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === selectedUser) {
        const change = Number(adjustAmount) * (adjustAction === "add" ? 1 : -1);
        return {
          ...u,
          balance: Math.max(0, u.balance + change)
        };
      }
      return u;
    }));

    setAdjustAmount("");
    alert("User balance updated successfully!");
  };

  // Check login state
  if (!isAdminLoggedIn) {
    return (
      <div style={localStyles.gateContainer}>
        <div className="card animate-fade-in" style={localStyles.gateCard}>
          <div style={localStyles.gateHeader}>
            <div style={localStyles.iconWrapper}>
              <Lock size={32} color="var(--error)" />
            </div>
            <h2>Admin Security Portal</h2>
            <p>Authorized personnel only. Please enter the management password to access the panel.</p>
          </div>

          <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Password PIN</label>
              <input 
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                style={{ width: "100%" }}
                required
              />
              {loginError && <span style={localStyles.errorText}>{loginError}</span>}
            </div>

            <button type="submit" className="btn btn-danger" style={{ width: "100%", padding: "12px", background: "var(--error)", color: "#fff" }}>
              Unlock System Panel
            </button>
            
            <Link href="/dashboard" className="btn btn-secondary" style={{ width: "100%", padding: "12px" }}>
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.adminContainer}>
      {/* Sidebar Panel */}
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <Link href="/dashboard" style={styles.logoLink}>
            <Smartphone size={24} color="var(--primary)" />
            <span style={styles.logoText}>Catch<span style={{ color: "var(--primary)" }}>Otp</span>.in</span>
          </Link>
          <span style={styles.adminBadge}>Admin Console</span>
        </div>

        <nav style={styles.sideNav}>
          <a href="#stats" style={styles.navBtnActive}><TrendingUp size={18} /> System Overview</a>
          <a href="#settings" style={styles.navBtn}><Settings size={18} /> API Config Settings</a>
          <a href="#users" style={styles.navBtn}><Users size={18} /> Users Manager</a>
          <button onClick={() => setIsAdminLoggedIn(false)} style={styles.navBtn}><Lock size={18} /> Lock Console</button>
          <Link href="/dashboard" style={styles.navBtn}><ArrowLeft size={18} /> Exit Admin</Link>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <ShieldAlert size={16} color="var(--error)" />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Secure Admin Session</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main style={styles.mainContent}>
        <header style={styles.topbar}>
          <h2>Administrator Portal</h2>
          <div style={styles.topbarBadge}>
            <Database size={16} color="var(--primary)" />
            <span>Mock Database Engine</span>
          </div>
        </header>

        {/* Stats Grid */}
        <section id="stats" style={styles.statsSection}>
          <div className="card" style={styles.statCard}>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Upstream API Balance</span>
              <h3 style={styles.statVal}>${systemStats.apiBalance.toFixed(2)}</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--primary)" }}>Connected to {provider}</span>
            </div>
            <div style={{...styles.statIconWrapper, background: "rgba(99, 102, 241, 0.08)"}}>
              <Database size={24} color="var(--secondary)" />
            </div>
          </div>

          <div className="card" style={styles.statCard}>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Total Platform Revenue</span>
              <h3 style={styles.statVal}>₹{systemStats.totalEarnings.toLocaleString()}</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--primary)" }}>+12% this week</span>
            </div>
            <div style={{...styles.statIconWrapper, background: "rgba(16, 185, 129, 0.08)"}}>
              <DollarSign size={24} color="var(--primary)" />
            </div>
          </div>

          <div className="card" style={styles.statCard}>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Completed OTP Leases</span>
              <h3 style={styles.statVal}>{systemStats.totalOrders}</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Across all countries</span>
            </div>
            <div style={{...styles.statIconWrapper, background: "rgba(245, 158, 11, 0.08)"}}>
              <Smartphone size={24} color="var(--accent)" />
            </div>
          </div>
        </section>

        {/* Configuration Forms Section */}
        <div style={styles.panelGrid}>
          {/* API Configuration Settings */}
          <section id="settings" className="card">
            <h3 style={{ marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Key size={20} color="var(--primary)" /> SMS Gateway Config
            </h3>
            
            <form onSubmit={handleSaveSettings} style={styles.form}>
              <div className="form-group">
                <label className="form-label">SMS Provider API Provider</label>
                <select 
                  value={provider} 
                  onChange={(e) => setProvider(e.target.value)}
                  className="input"
                  style={{ width: "100%", background: "var(--bg-input)" }}
                >
                  <option value="sms-activate">SMS-Activate (sms-activate.org)</option>
                  <option value="5sim">5SIM (5sim.net)</option>
                  <option value="smsman">SMS-Man (sms-man.com)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">API Key / Token</label>
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  className="input" 
                  style={{ width: "100%" }}
                  placeholder="Enter API secret token"
                />
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  This key remains encrypted on the server side and is never exposed to public browsers.
                </span>
              </div>

              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Profit Multiplier</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="1.0"
                    value={multiplier} 
                    onChange={(e) => setMultiplier(e.target.value)}
                    className="input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Flat Markup Fee (₹)</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0"
                    value={flatFee} 
                    onChange={(e) => setFlatFee(e.target.value)}
                    className="input"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }}>
                {saveStatus === "saving" ? (
                  <RefreshCw className="animate-spin" size={16} />
                ) : saveStatus === "success" ? (
                  <><Check size={16} /> Config Saved!</>
                ) : (
                  <><Save size={16} /> Save Gateway Settings</>
                )}
              </button>
            </form>
          </section>

          {/* User Balance Manager */}
          <section id="users" className="card" style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{ marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
              <PlusCircle size={20} color="var(--primary)" /> Adjust User Wallet
            </h3>

            <form onSubmit={handleAdjustBalance} style={{...styles.form, marginTop: "auto", marginBottom: "auto"}}>
              <div className="form-group">
                <label className="form-label">Select Registered User</label>
                <select 
                  value={selectedUser} 
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="input"
                  style={{ width: "100%", background: "var(--bg-input)" }}
                >
                  <option value="">-- Choose User --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username} (Bal: ₹{u.balance.toFixed(2)})</option>
                  ))}
                </select>
              </div>

              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1.2 }}>
                  <label className="form-label">Amount (INR)</label>
                  <input 
                    type="number" 
                    min="1"
                    placeholder="50"
                    value={adjustAmount} 
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Operation</label>
                  <select 
                    value={adjustAction} 
                    onChange={(e) => setAdjustAction(e.target.value)}
                    className="input"
                    style={{ width: "100%", background: "var(--bg-input)" }}
                  >
                    <option value="add">Add Cash</option>
                    <option value="deduct">Deduct Cash</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "12px" }}>
                Apply Balance Correction
              </button>
            </form>
          </section>
        </div>

        {/* Users Table */}
        <section className="card">
          <h3 style={{ marginBottom: "20px" }}>Registered Platform Users</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User ID</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Email Address</th>
                  <th style={styles.th}>Wallet Balance</th>
                  <th style={styles.th}>Registered Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}>#{u.id}</td>
                    <td style={styles.td}><strong style={{ color: "#ffffff" }}>{u.username}</strong></td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}><span style={{ color: "var(--primary)", fontWeight: 700 }}>₹{u.balance.toFixed(2)}</span></td>
                    <td style={styles.td}>{u.registered}</td>
                    <td style={styles.td}>
                      <span className="badge badge-success">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

const localStyles = {
  gateContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "var(--bg-main)",
    padding: "20px",
  },
  gateCard: {
    maxWidth: "420px",
    width: "100%",
    padding: "32px",
  },
  gateHeader: {
    textAlign: "center",
    marginBottom: "24px",
  },
  iconWrapper: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "rgba(239, 68, 68, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px auto",
  },
  errorText: {
    color: "var(--error)",
    fontSize: "0.75rem",
    marginTop: "4px",
    display: "block",
  }
};

const styles = {
  adminContainer: {
    display: "flex",
    minHeight: "100vh",
    background: "var(--bg-main)",
  },
  sidebar: {
    width: "260px",
    background: "var(--bg-darker)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    flexShrink: 0,
  },
  logoArea: {
    marginBottom: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoText: {
    fontFamily: "var(--font-display)",
    fontSize: "1.25rem",
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: "-0.02em",
  },
  adminBadge: {
    alignSelf: "flex-start",
    fontSize: "0.65rem",
    fontWeight: 700,
    background: "rgba(239, 68, 68, 0.12)",
    color: "var(--error)",
    padding: "2px 8px",
    borderRadius: "var(--radius-full)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  sideNav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "var(--radius-md)",
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
    transition: "all var(--transition-fast)",
    width: "100%",
  },
  navBtnActive: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "var(--radius-md)",
    background: "rgba(16, 185, 129, 0.06)",
    color: "var(--primary)",
    borderLeft: "3px solid var(--primary)",
    paddingLeft: "13px",
    fontSize: "0.95rem",
    fontWeight: 600,
    textAlign: "left",
  },
  sidebarFooter: {
    borderTop: "1px solid var(--border)",
    paddingTop: "16px",
    marginTop: "auto",
  },
  mainContent: {
    flexGrow: 1,
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    overflowY: "auto",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "16px",
  },
  topbarBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(99, 102, 241, 0.08)",
    border: "1px solid rgba(99, 102, 241, 0.15)",
    padding: "6px 12px",
    borderRadius: "var(--radius-full)",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--secondary)",
  },
  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  statCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    fontWeight: 600,
  },
  statVal: {
    fontSize: "2.1rem",
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    color: "#ffffff",
    margin: "6px 0",
  },
  statIconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "var(--radius-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  panelGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    alignItems: "stretch",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formRow: {
    display: "flex",
    gap: "16px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    borderBottom: "1px solid var(--border)",
    padding: "14px 16px",
    color: "var(--text-muted)",
    fontSize: "0.85rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  tr: {
    borderBottom: "1px solid rgba(255,255,255,0.02)",
    transition: "background var(--transition-fast)",
  },
  td: {
    padding: "16px",
    fontSize: "0.95rem",
  },
};
