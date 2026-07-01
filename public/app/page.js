"use client";

import Link from "next/link";
import { Shield, Smartphone, Zap, CheckCircle2, ChevronRight, Lock, MessageSquare } from "lucide-react";

export default function Home() {
  const popularServices = [
    { name: "Telegram", price: "₹10", icon: "✈️" },
    { name: "WhatsApp", price: "₹15", icon: "💬" },
    { name: "Google", price: "₹8", icon: "🔍" },
    { name: "Discord", price: "₹6", icon: "🎮" },
    { name: "OpenAI / ChatGPT", price: "₹12", icon: "🤖" },
    { name: "Instagram", price: "₹7", icon: "📸" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header style={styles.header}>
        <div className="container" style={styles.headerContainer}>
          <div style={styles.logo}>
            <Smartphone size={24} color="var(--primary)" />
            <span style={styles.logoText}>Catch<span style={{ color: "var(--primary)" }}>Otp</span>.in</span>
          </div>
          
          <nav style={styles.nav}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#services" style={styles.navLink}>Services</a>
            <a href="#faqs" style={styles.navLink}>FAQs</a>
          </nav>

          <div style={styles.headerActions}>
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Dashboard <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div className="container animate-fade-in" style={styles.heroContainer}>
          <div style={styles.heroBadge}>
            <Zap size={14} color="var(--primary)" />
            <span>Fastest SMS Gateway 2026</span>
          </div>
          
          <h1 style={styles.heroTitle}>
            Bypass SMS Verification <br />
            <span className="text-gradient-emerald">Instantly & Privately</span>
          </h1>
          
          <p style={styles.heroSubtitle}>
            Rent virtual phone numbers from 50+ countries to receive OTPs for WhatsApp, Telegram, Google, and more. Maintain absolute privacy online.
          </p>

          <div style={styles.heroCta}>
            <Link href="/dashboard" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "1.05rem" }}>
              Get Started Now <ChevronRight size={18} />
            </Link>
            <a href="#services" className="btn btn-secondary" style={{ padding: "14px 28px", fontSize: "1.05rem" }}>
              View Pricing
            </a>
          </div>

          {/* Stats Bar */}
          <div style={styles.statsBar}>
            <div style={styles.statItem}>
              <span style={styles.statVal}>99.9%</span>
              <span style={styles.statLabel}>Success Rate</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statVal}>&lt; 5s</span>
              <span style={styles.statLabel}>Avg Delivery Time</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statVal}>10,000+</span>
              <span style={styles.statLabel}>Numbers Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Why Choose CatchOtp.in?</h2>
            <p style={styles.sectionSubtitle}>We offer the fastest and most secure disposable SMS bypass system in India.</p>
          </div>

          <div style={styles.featuresGrid}>
            <div className="card" style={styles.featureCard}>
              <div style={styles.iconWrapper}>
                <Zap size={24} color="var(--primary)" />
              </div>
              <h3 style={styles.featureTitle}>Instant Delivery</h3>
              <p>Numbers are provisioned instantly, and incoming OTPs are displayed on your dashboard in under 5 seconds.</p>
            </div>

            <div className="card" style={styles.featureCard}>
              <div style={styles.iconWrapper}>
                <Shield size={24} color="var(--primary)" />
              </div>
              <h3 style={styles.featureTitle}>Absolute Privacy</h3>
              <p>Keep your real phone number private. Avoid spam marketing calls and identity tracking by using our burner numbers.</p>
            </div>

            <div className="card" style={styles.featureCard}>
              <div style={styles.iconWrapper}>
                <Lock size={24} color="var(--primary)" />
              </div>
              <h3 style={styles.featureTitle}>Secure API Wrapper</h3>
              <p>Our Vercel serverless backend proxies all requests, keeping credentials hidden from public eyes. Secure and stable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Pricing Section */}
      <section id="services" style={styles.darkSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Supported Platforms & Pricing</h2>
            <p style={styles.sectionSubtitle}>Simple pay-per-use rates. You only pay if you receive the OTP code!</p>
          </div>

          <div style={styles.servicesGrid}>
            {popularServices.map((service, index) => (
              <div className="card" key={index} style={styles.serviceCard}>
                <div style={styles.serviceIcon}>{service.icon}</div>
                <h3 style={styles.serviceName}>{service.name}</h3>
                <div style={styles.servicePrice}>
                  <span style={styles.priceLabel}>Starts from</span>
                  <span style={styles.priceValue}>{service.price}</span>
                </div>
                <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ width: "100%", marginTop: "12px" }}>
                  Get Number
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p style={styles.sectionSubtitle}>Got questions? We have answers.</p>
          </div>

          <div style={styles.faqList}>
            <div className="card" style={styles.faqCard}>
              <h4 style={styles.faqQuestion}>How does CatchOtp.in work?</h4>
              <p style={{ marginTop: "8px" }}>
                Select the country and application (e.g. WhatsApp, Google) you want to register. We generate a temporary virtual number. Copy this number to the app and send the OTP. The OTP code will appear on your dashboard screen in a few seconds.
              </p>
            </div>

            <div className="card" style={styles.faqCard}>
              <h4 style={styles.faqQuestion}>What if I don&apos;t get the OTP?</h4>
              <p style={{ marginTop: "8px" }}>
                If you do not receive the OTP within the 15-minute countdown, you can cancel the activation. Your money will automatically refund to your wallet instantly. No risk.
              </p>
            </div>

            <div className="card" style={styles.faqCard}>
              <h4 style={styles.faqQuestion}>Is Vercel deployment secure?</h4>
              <p style={{ marginTop: "8px" }}>
                Yes, our site works as a serverless application. Sensitive keys (such as the SMS provider API key) are kept strictly in backend environment variables, making it impossible for someone to steal your keys from the source code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section style={styles.ctaFooter}>
        <div className="container" style={styles.ctaFooterContainer}>
          <h2 style={styles.ctaFooterTitle}>Ready to Catch Some OTPs?</h2>
          <p style={styles.ctaFooterSubtitle}>Deploy CatchOtp.in to your GitHub repository and build on Vercel instantly.</p>
          <Link href="/dashboard" className="btn btn-primary" style={{ padding: "14px 28px", marginTop: "24px" }}>
            Open Dashboard Panel
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container" style={styles.footerContainer}>
          <span>© 2026 CatchOtp.in. All rights reserved. Created with security first.</span>
          <div style={styles.footerLinks}>
            <Link href="/admin" style={styles.footerLink}>Admin Login</Link>
            <a href="#" style={styles.footerLink}>Terms of Service</a>
            <a href="#" style={styles.footerLink}>Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  header: {
    background: "rgba(12, 15, 23, 0.75)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    padding: "16px 0",
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoText: {
    fontFamily: "var(--font-display)",
    fontSize: "1.35rem",
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: "-0.02em",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },
  navLink: {
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "var(--text-muted)",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  heroSection: {
    padding: "96px 0 80px 0",
    textAlign: "center",
  },
  heroContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "800px",
  },
  heroBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    padding: "6px 14px",
    borderRadius: "var(--radius-full)",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--primary)",
    marginBottom: "24px",
  },
  heroTitle: {
    fontSize: "3.2rem",
    lineHeight: "1.15",
    marginBottom: "20px",
  },
  heroSubtitle: {
    fontSize: "1.15rem",
    maxWidth: "600px",
    marginBottom: "36px",
  },
  heroCta: {
    display: "flex",
    gap: "16px",
    marginBottom: "64px",
  },
  statsBar: {
    display: "flex",
    alignItems: "center",
    background: "rgba(18, 24, 38, 0.4)",
    backdropFilter: "blur(8px)",
    border: "1px solid var(--border)",
    padding: "20px 48px",
    borderRadius: "var(--radius-lg)",
    gap: "32px",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statVal: {
    fontSize: "1.8rem",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    color: "#ffffff",
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    marginTop: "4px",
  },
  statDivider: {
    width: "1px",
    height: "36px",
    background: "var(--border)",
  },
  section: {
    padding: "80px 0",
  },
  darkSection: {
    padding: "80px 0",
    background: "rgba(7, 9, 14, 0.5)",
  },
  sectionHeader: {
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 48px auto",
  },
  sectionTitle: {
    fontSize: "2.2rem",
    marginBottom: "12px",
  },
  sectionSubtitle: {
    fontSize: "1.05rem",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  featureCard: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "36px",
  },
  iconWrapper: {
    width: "52px",
    height: "52px",
    borderRadius: "var(--radius-md)",
    background: "rgba(16, 185, 129, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
  },
  featureTitle: {
    fontSize: "1.3rem",
    fontWeight: 600,
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  serviceCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "24px 16px",
  },
  serviceIcon: {
    fontSize: "2.5rem",
    marginBottom: "12px",
  },
  serviceName: {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: "8px",
  },
  servicePrice: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    margin: "8px 0",
  },
  priceLabel: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
  },
  priceValue: {
    fontSize: "1.2rem",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    color: "var(--primary)",
  },
  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  faqCard: {
    padding: "24px",
  },
  faqQuestion: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#ffffff",
  },
  ctaFooter: {
    padding: "96px 0",
    textAlign: "center",
    background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.08) 0%, transparent 60%)",
  },
  ctaFooterContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  ctaFooterTitle: {
    fontSize: "2.6rem",
    marginBottom: "12px",
  },
  ctaFooterSubtitle: {
    fontSize: "1.1rem",
    maxWidth: "500px",
  },
  footer: {
    padding: "32px 0",
    borderTop: "1px solid var(--border)",
    background: "var(--bg-darker)",
    fontSize: "0.85rem",
    color: "var(--text-muted)",
  },
  footerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  footerLinks: {
    display: "flex",
    gap: "20px",
  },
  footerLink: {
    color: "var(--text-muted)",
    transition: "color var(--transition-fast)",
  },
};
