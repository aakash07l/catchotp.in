"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Smartphone, Search, Wallet, Plus, Clock, Copy, Check, Trash2, 
  RefreshCw, LogOut, ShieldAlert, Award, ChevronDown, CheckCircle, Database 
} from "lucide-react";

export default function Dashboard() {
  // Mock User Wallet Balance
  const [balance, setBalance] = useState(150.0);
  
  // Selection states
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [searchService, setSearchService] = useState("");
  const [activeTab, setActiveTab] = useState("rent"); // rent, history, add-funds
  
  // Recharge modal / state
  const [rechargeAmount, setRechargeAmount] = useState("100");
  const [rechargeStep, setRechargeStep] = useState(1); // 1: input, 2: qr, 3: success
  const [copiedText, setCopiedText] = useState("");
  
  // Active activations list
  const [activations, setActivations] = useState([]);
  
  // Completed History
  const [history, setHistory] = useState([
    { id: "1001", service: "Google", number: "+91 98765 43210", code: "492041", price: 8, status: "Completed", date: "2026-06-30 18:45" },
    { id: "1002", service: "Telegram", number: "+91 99999 88888", code: "77218", price: 10, status: "Completed", date: "2026-06-30 14:10" }
  ]);

  // Countries catalog
  const countries = [
    { name: "India", code: "IN", flag: "🇮🇳" },
    { name: "United States", code: "US", flag: "🇺🇸" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
    { name: "Russia", code: "RU", flag: "🇷🇺" },
    { name: "Bangladesh", code: "BD", flag: "🇧🇩" },
    { name: "Brazil", code: "BR", flag: "🇧🇷" },
  ];

  // Services catalog with prices
  const services = [
    { id: "tg", name: "Telegram", price: 10, icon: "✈️" },
    { id: "wa", name: "WhatsApp", price: 15, icon: "💬" },
    { id: "google", name: "Google / Gmail", price: 8, icon: "🔍" },
    { id: "discord", name: "Discord", price: 6, icon: "🎮" },
    { id: "openai", name: "OpenAI / ChatGPT", price: 12, icon: "🤖" },
    { id: "insta", name: "Instagram", price: 7, icon: "📸" },
    { id: "ms", name: "Microsoft", price: 5, icon: "💻" },
    { id: "steam", name: "Steam", price: 6, icon: "🕹️" },
    { id: "netflix", name: "Netflix", price: 9, icon: "🎬" },
    { id: "apple", name: "Apple", price: 11, icon: "🍎" },
  ];

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchService.toLowerCase())
  );

  // Copy helper
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(""), 2000);
  };

  // Countdown timers hook
  useEffect(() => {
    const timer = setInterval(() => {
      setActivations(prev => {
        return prev.map(act => {
          if (act.timeLeft > 0) {
            return { ...act, timeLeft: act.timeLeft - 1 };
          }
          return act;
        }).filter(act => {
          // Auto remove/cancel if timer hits 0
          if (act.timeLeft === 0) {
            // Refund balance (simulated)
            setBalance(b => b + act.price);
            return false;
          }
          return true;
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rent service function
  const handleRent = (service) => {
    if (balance < service.price) {
      alert("Insufficient Balance! Please add funds to your wallet.");
      setActiveTab("add-funds");
      return;
    }

    // Deduct balance
    setBalance(prev => prev - service.price);

    // Generate random mock number based on selected country
    let mockNum = "";
    if (selectedCountry === "India") mockNum = "+91 " + Math.floor(6000000000 + Math.random() * 3999999999);
    else if (selectedCountry === "United States") mockNum = "+1 " + Math.floor(2000000000 + Math.random() * 7999999999);
    else if (selectedCountry === "United Kingdom") mockNum = "+44 7" + Math.floor(100000000 + Math.random() * 899999999);
    else mockNum = "+7 9" + Math.floor(100000000 + Math.random() * 899999999);

    const newActivation = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      service: service.name,
      icon: service.icon,
      number: mockNum,
      price: service.price,
      status: "Waiting for SMS", // "Waiting for SMS" or "SMS Received"
      code: "",
      timeLeft: 900, // 15 minutes
    };

    setActivations(prev => [newActivation, ...prev]);

    // Simulate SMS arrival after 12 seconds
    setTimeout(() => {
      setActivations(prev => {
        return prev.map(act => {
          if (act.id === newActivation.id) {
            const mockCode = Math.floor(10000 + Math.random() * 90000).toString();
            return {
              ...act,
              status: "SMS Received",
              code: mockCode
            };
          }
          return act;
        });
      });
    }, 12000);
  };

  // Cancel activation
  const handleCancel = (act) => {
    // Refund balance
    setBalance(prev => prev + act.price);
    
    // Remove from active list
    setActivations(prev => prev.filter(a => a.id !== act.id));
  };

  // Complete activation
  const handleComplete = (act) => {
    // Save to history
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setHistory(prev => [
      {
        id: act.id,
        service: act.service,
        number: act.number,
        code: act.code || "No Code",
        price: act.price,
        status: act.code ? "Completed" : "Cancelled",
        date: dateStr
      },
      ...prev
    ]);

    // Remove from active list
    setActivations(prev => prev.filter(a => a.id !== act.id));
  };

  // Formatter for seconds to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Handle mock payment submit
  const handleRechargeSubmit = (e) => {
    e.preventDefault();
    if (!rechargeAmount || isNaN(rechargeAmount) || Number(rechargeAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setRechargeStep(2); // show qr code
  };

  const handleConfirmPayment = () => {
    setRechargeStep(3); // success
    setTimeout(() => {
      setBalance(prev => prev + Number(rechargeAmount));
      setRechargeStep(1);
      setRechargeAmount("100");
      setActiveTab("rent");
    }, 2000);
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar Panel */}
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <Link href="/" style={styles.logoLink}>
            <Smartphone size={24} color="var(--primary)" />
            <span style={styles.logoText}>Catch<span style={{ color: "var(--primary)" }}>Otp</span>.in</span>
          </Link>
        </div>

        {/* User Balance Wallet Card */}
        <div style={styles.walletCard}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={styles.walletIconWrapper}>
              <Wallet size={20} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Wallet Balance</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>₹{balance.toFixed(2)}</div>
            </div>
          </div>
          <button onClick={() => setActiveTab("add-funds")} style={styles.addFundsBtn}>
            <Plus size={16} /> Add Funds
          </button>
        </div>

        {/* Sidebar Nav Tabs */}
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab("rent")} 
            style={{...styles.navBtn, ...(activeTab === "rent" ? styles.navBtnActive : {})}}
          >
            <Smartphone size={18} /> Rent Numbers
          </button>
          <button 
            onClick={() => setActiveTab("history")} 
            style={{...styles.navBtn, ...(activeTab === "history" ? styles.navBtnActive : {})}}
          >
            <Clock size={18} /> Order History
          </button>
          <button 
            onClick={() => setActiveTab("add-funds")} 
            style={{...styles.navBtn, ...(activeTab === "add-funds" ? styles.navBtnActive : {})}}
          >
            <Wallet size={18} /> Add Funds
          </button>
          <Link href="/admin" style={styles.navBtn}>
            <Database size={18} /> Admin Panel
          </Link>
        </nav>

        {/* Info Box */}
        <div style={styles.infoBox}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Database size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>Demo Backend Active</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
                This is a mock workspace. Real API key configuration endpoints can be updated inside the Admin Panel.
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div style={styles.sidebarFooter}>
          <Link href="/" style={styles.logoutBtn}>
            <LogOut size={16} /> Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main style={styles.mainContent}>
        {/* Top Navbar */}
        <header style={styles.topbar}>
          <div style={styles.topbarLeft}>
            <h2>{activeTab === "rent" ? "SMS Activation Center" : activeTab === "history" ? "Activation History" : "Recharge Wallet"}</h2>
          </div>
          <div style={styles.topbarRight}>
            <div style={styles.topbarBadge}>
              <div style={styles.badgePulse} />
              <span>Gateway Live</span>
            </div>
          </div>
        </header>

        {/* RENT TAB VIEW */}
        {activeTab === "rent" && (
          <div style={styles.tabGrid}>
            {/* Rent Selection Sidebar Card */}
            <div style={styles.selectionPanel}>
              {/* 1. Country Selection */}
              <div className="card" style={{ marginBottom: "20px" }}>
                <h3 style={styles.cardHeaderTitle}>1. Select Target Country</h3>
                <div style={styles.countryGrid}>
                  {countries.map((c, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedCountry(c.name)}
                      style={{
                        ...styles.countryBtn, 
                        ...(selectedCountry === c.name ? styles.countryBtnActive : {})
                      }}
                    >
                      <span style={{ fontSize: "1.4rem" }}>{c.flag}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Service Search and List */}
              <div className="card" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 430px)", minHeight: "400px" }}>
                <h3 style={styles.cardHeaderTitle}>2. Select Target App</h3>
                <div style={styles.searchWrapper}>
                  <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "11px" }} />
                  <input 
                    type="text" 
                    placeholder="Search apps (e.g. WhatsApp, Google)" 
                    value={searchService} 
                    onChange={(e) => setSearchService(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
                <div style={styles.serviceList}>
                  {filteredServices.map((service, index) => (
                    <div key={index} style={styles.serviceListItem}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={styles.listIcon}>{service.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{service.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Country: {selectedCountry}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={styles.listPrice}>₹{service.price}</span>
                        <button 
                          onClick={() => handleRent(service)} 
                          className="btn btn-primary btn-sm"
                          style={{ borderRadius: "var(--radius-sm)" }}
                        >
                          Rent
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredServices.length === 0 && (
                    <div style={styles.noResults}>No services found matching your search.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Active Activations Panel */}
            <div style={styles.activePanel}>
              <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={styles.cardHeaderTitle}>Active Numbers ({activations.length})</h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Numbers auto-cancel if no OTP is received</span>
                </div>

                <div style={styles.activationsContainer}>
                  {activations.map((act) => (
                    <div key={act.id} style={styles.activationCard}>
                      <div style={styles.actTop}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={styles.actIcon}>{act.icon}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{act.service}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ID: {act.id}</div>
                          </div>
                        </div>
                        <div style={styles.actTimer}>
                          <Clock size={14} color="var(--primary)" />
                          <span>{formatTime(act.timeLeft)}</span>
                        </div>
                      </div>

                      <div style={styles.actMiddle}>
                        <div style={styles.numberDisplay}>
                          <span style={styles.numberText}>{act.number}</span>
                          <button 
                            onClick={() => handleCopy(act.number, `num-${act.id}`)}
                            style={styles.actCopyBtn}
                            title="Copy Phone Number"
                          >
                            {copiedText === `num-${act.id}` ? <Check size={16} color="var(--primary)" /> : <Copy size={16} />}
                          </button>
                        </div>

                        {/* OTP Code Box */}
                        <div style={styles.otpBox}>
                          {act.status === "Waiting for SMS" ? (
                            <div style={styles.waitingContainer}>
                              <div className="shimmer" style={styles.loadingPulse} />
                              <span style={styles.waitingText}>Waiting for SMS...</span>
                            </div>
                          ) : (
                            <div style={styles.receivedContainer}>
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600, textTransform: "uppercase" }}>OTP Received</span>
                                <span style={styles.otpText}>{act.code}</span>
                              </div>
                              <button 
                                onClick={() => handleCopy(act.code, `code-${act.id}`)}
                                style={styles.otpCopyBtn}
                                title="Copy Verification Code"
                              >
                                {copiedText === `code-${act.id}` ? <Check size={18} color="white" /> : <Copy size={18} />}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={styles.actBottom}>
                        <button 
                          onClick={() => handleCancel(act)} 
                          className="btn btn-danger btn-sm"
                          style={{ width: "48%" }}
                        >
                          <Trash2 size={14} /> Cancel & Refund
                        </button>
                        <button 
                          onClick={() => handleComplete(act)} 
                          className="btn btn-primary btn-sm"
                          style={{ width: "48%", background: act.code ? "var(--primary)" : "rgba(255,255,255,0.05)", color: act.code ? "var(--bg-darker)" : "var(--text-muted)" }}
                        >
                          <CheckCircle size={14} /> Complete
                        </button>
                      </div>
                    </div>
                  ))}

                  {activations.length === 0 && (
                    <div style={styles.emptyActivations}>
                      <Smartphone size={48} color="var(--text-dark)" style={{ marginBottom: "16px" }} />
                      <h3>No Active Numbers Rented</h3>
                      <p style={{ maxWidth: "300px", marginTop: "8px", fontSize: "0.85rem" }}>
                        Select a country and service on the left side to get a virtual phone number.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDER HISTORY TAB VIEW */}
        {activeTab === "history" && (
          <div className="card animate-fade-in">
            <h3 style={{ marginBottom: "20px" }}>Your Purchase History</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Activation ID</th>
                    <th style={styles.th}>Service</th>
                    <th style={styles.th}>Phone Number</th>
                    <th style={styles.th}>OTP Code</th>
                    <th style={styles.th}>Cost</th>
                    <th style={styles.th}>Date & Time</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row, i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>#{row.id}</td>
                      <td style={styles.td}>{row.service}</td>
                      <td style={styles.td}>{row.number}</td>
                      <td style={styles.td}>
                        <strong style={{ color: "var(--primary)", fontSize: "1.05rem" }}>{row.code}</strong>
                      </td>
                      <td style={styles.td}>₹{row.price}</td>
                      <td style={styles.td}>{row.date}</td>
                      <td style={styles.td}>
                        <span className={`badge ${row.status === "Completed" ? "badge-success" : "badge-danger"}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADD FUNDS / RECHARGE TAB VIEW */}
        {activeTab === "add-funds" && (
          <div className="card animate-fade-in" style={{ maxWidth: "550px", margin: "0 auto" }}>
            <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Wallet color="var(--primary)" /> Top-Up Your Wallet
            </h3>
            <p style={{ marginBottom: "24px", fontSize: "0.9rem" }}>
              Add money to your CatchOtp wallet using UPI or Cryptocurrency instantly. Minimum deposit is ₹50.
            </p>

            {rechargeStep === 1 && (
              <form onSubmit={handleRechargeSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="form-group">
                  <label className="form-label">Enter Recharge Amount (INR)</label>
                  <div style={{ position: "relative" }}>
                    <span style={styles.inputCurrency}>₹</span>
                    <input 
                      type="number" 
                      min="50" 
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(e.target.value)}
                      className="input" 
                      style={{ paddingLeft: "32px", width: "100%" }}
                      placeholder="100"
                    />
                  </div>
                </div>

                <div style={styles.presetGrid}>
                  {["50", "100", "200", "500"].map((preset) => (
                    <button 
                      type="button" 
                      key={preset} 
                      onClick={() => setRechargeAmount(preset)}
                      style={{
                        ...styles.presetBtn, 
                        ...(rechargeAmount === preset ? styles.presetBtnActive : {})
                      }}
                    >
                      + ₹{preset}
                    </button>
                  ))}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
                  Generate Payment Request
                </button>
              </form>
            )}

            {rechargeStep === 2 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px" }}>
                <div style={styles.qrContainer}>
                  {/* Simulated QR Code */}
                  <div style={styles.qrBox}>
                    <div style={{ width: "160px", height: "160px", background: "#fff", display: "flex", alignItems: "center", justifyItems: "center", padding: "10px", margin: "0 auto" }}>
                      {/* Generates a simple grid to represent QR Code */}
                      <div style={{ width: "100%", height: "100%", backgroundImage: "linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }} />
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff" }}>Amount: ₹{rechargeAmount}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>Scan using BHIM, GPay, Paytm, or PhonePe</div>
                </div>

                <div style={styles.upiBox}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>UPI Address</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>pay@catchotp</span>
                  </div>
                  <button 
                    onClick={() => handleCopy("pay@catchotp", "upi")}
                    style={styles.actCopyBtn}
                  >
                    {copiedText === "upi" ? <Check size={16} color="var(--primary)" /> : <Copy size={16} />}
                  </button>
                </div>

                <div style={{ display: "flex", gap: "12px", width: "100%", marginTop: "12px" }}>
                  <button onClick={() => setRechargeStep(1)} className="btn btn-secondary" style={{ width: "50%" }}>
                    Cancel
                  </button>
                  <button onClick={handleConfirmPayment} className="btn btn-primary" style={{ width: "50%" }}>
                    Confirm Payment
                  </button>
                </div>
              </div>
            )}

            {rechargeStep === 3 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px 0", gap: "16px" }}>
                <div style={styles.successPulse}>
                  <CheckCircle size={48} color="var(--primary)" />
                </div>
                <div>
                  <h3>Payment Successful!</h3>
                  <p style={{ marginTop: "6px" }}>₹{rechargeAmount} has been credited to your wallet balance.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  dashboardContainer: {
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
  walletCard: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "16px",
    marginBottom: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  walletIconWrapper: {
    width: "36px",
    height: "36px",
    borderRadius: "var(--radius-md)",
    background: "rgba(16, 185, 129, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addFundsBtn: {
    width: "100%",
    background: "var(--primary)",
    color: "var(--bg-darker)",
    border: "none",
    padding: "8px 0",
    borderRadius: "var(--radius-md)",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "background var(--transition-fast)",
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
  },
  navBtnActive: {
    background: "rgba(16, 185, 129, 0.06)",
    color: "var(--primary)",
    borderLeft: "3px solid var(--primary)",
    paddingLeft: "13px",
  },
  infoBox: {
    marginTop: "auto",
    background: "rgba(16, 185, 129, 0.04)",
    border: "1px solid rgba(16, 185, 129, 0.1)",
    borderRadius: "var(--radius-md)",
    padding: "12px",
    marginBottom: "16px",
  },
  sidebarFooter: {
    borderTop: "1px solid var(--border)",
    paddingTop: "16px",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--text-muted)",
    fontSize: "0.85rem",
    fontWeight: 500,
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
  topbarLeft: {
    display: "flex",
    flexDirection: "column",
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
  },
  topbarBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.15)",
    padding: "6px 12px",
    borderRadius: "var(--radius-full)",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--primary)",
  },
  badgePulse: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--primary)",
    boxShadow: "0 0 8px var(--primary)",
    animation: "pulse-glow 1.5s infinite",
  },
  tabGrid: {
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: "24px",
    alignItems: "start",
  },
  selectionPanel: {
    display: "flex",
    flexDirection: "column",
  },
  cardHeaderTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: "16px",
  },
  countryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
  },
  countryBtn: {
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    color: "var(--text-main)",
    transition: "all var(--transition-fast)",
  },
  countryBtnActive: {
    borderColor: "var(--primary)",
    background: "rgba(16, 185, 129, 0.05)",
    boxShadow: "0 0 10px var(--primary-glow)",
  },
  searchWrapper: {
    position: "relative",
    marginBottom: "16px",
  },
  searchInput: {
    width: "100%",
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "10px 12px 10px 38px",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color var(--transition-fast)",
  },
  serviceList: {
    flexGrow: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingRight: "4px",
  },
  serviceListItem: {
    background: "rgba(255,255,255,0.01)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background var(--transition-fast)",
  },
  listIcon: {
    fontSize: "1.6rem",
  },
  listPrice: {
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: "var(--font-display)",
    color: "var(--primary)",
  },
  noResults: {
    textAlign: "center",
    color: "var(--text-muted)",
    padding: "20px 0",
    fontSize: "0.85rem",
  },
  activePanel: {
    height: "calc(100vh - 170px)",
    minHeight: "500px",
  },
  activationsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
    overflowY: "auto",
    flexGrow: 1,
    paddingRight: "4px",
  },
  activationCard: {
    background: "rgba(18, 24, 38, 0.9)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "var(--radius-lg)",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  actTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actIcon: {
    fontSize: "1.5rem",
  },
  actTimer: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--primary)",
    background: "rgba(16, 185, 129, 0.06)",
    padding: "4px 8px",
    borderRadius: "var(--radius-full)",
  },
  actMiddle: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  numberDisplay: {
    background: "var(--bg-input)",
    borderRadius: "var(--radius-md)",
    padding: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid var(--border)",
  },
  numberText: {
    fontFamily: "var(--font-display)",
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    color: "#ffffff",
  },
  actCopyBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "none",
    color: "var(--text-muted)",
    width: "28px",
    height: "28px",
    borderRadius: "var(--radius-sm)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "color var(--transition-fast)",
  },
  otpBox: {
    background: "rgba(16, 185, 129, 0.02)",
    border: "1px dashed rgba(16, 185, 129, 0.2)",
    borderRadius: "var(--radius-md)",
    padding: "14px",
    minHeight: "68px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  waitingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  loadingPulse: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "var(--primary)",
    animation: "pulse-glow 1.5s infinite",
  },
  waitingText: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    fontWeight: 500,
  },
  receivedContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  otpText: {
    fontFamily: "var(--font-display)",
    fontSize: "1.6rem",
    fontWeight: 800,
    letterSpacing: "0.1em",
    color: "var(--primary)",
    marginTop: "2px",
  },
  otpCopyBtn: {
    background: "var(--primary)",
    border: "none",
    color: "var(--bg-darker)",
    width: "36px",
    height: "36px",
    borderRadius: "var(--radius-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  actBottom: {
    display: "flex",
    justifyContent: "space-between",
  },
  emptyActivations: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    flexGrow: 1,
    padding: "40px 0",
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
  inputCurrency: {
    position: "absolute",
    left: "14px",
    top: "12px",
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "var(--text-muted)",
  },
  presetGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
  },
  presetBtn: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "8px",
    color: "var(--text-main)",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  presetBtnActive: {
    borderColor: "var(--primary)",
    color: "var(--primary)",
    background: "rgba(16, 185, 129, 0.05)",
  },
  qrContainer: {
    background: "#ffffff",
    padding: "16px",
    borderRadius: "var(--radius-lg)",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
  },
  qrBox: {
    width: "180px",
    height: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  upiBox: {
    background: "var(--bg-input)",
    borderRadius: "var(--radius-md)",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    border: "1px solid var(--border)",
    marginTop: "8px",
  },
  successPulse: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(16, 185, 129, 0.08)",
    border: "2px solid var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 20px var(--primary-glow-strong)",
  },
};
