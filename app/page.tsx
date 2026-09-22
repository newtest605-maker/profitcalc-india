"use client";
import { useMemo, useState } from "react";

type Key = string;

type Tool = { id: string; name: string; desc: string; icon: string; tag: string };

const tools: Tool[] = [
  { id: "emi", name: "EMI Calculator", desc: "Plan your monthly loan payment", icon: "₹", tag: "Loans" },
  { id: "salary", name: "Salary Calculator", desc: "Estimate monthly in-hand salary", icon: "↗", tag: "Salary" },
  { id: "gst", name: "GST Calculator", desc: "Add GST or find GST amount", icon: "%", tag: "Tax" },
  { id: "profit", name: "Profit Margin", desc: "Know profit per sale", icon: "⌁", tag: "Business" },
  { id: "roi", name: "ROI Calculator", desc: "Measure investment return", icon: "◈", tag: "Investing" },
  { id: "sip", name: "SIP Calculator", desc: "Estimate your SIP corpus", icon: "＋", tag: "Investing" },
  { id: "compound", name: "Compound Interest", desc: "See money grow over time", icon: "∞", tag: "Investing" },
  { id: "discount", name: "Discount Calculator", desc: "Find your final sale price", icon: "%", tag: "Shopping" },
  { id: "markup", name: "Markup Calculator", desc: "Set selling price from cost", icon: "↑", tag: "Business" },
  { id: "break", name: "Break-even Calculator", desc: "Find units needed to recover costs", icon: "≈", tag: "Business" },
];

const initial: Record<Key, string> = {
  amount: "", rate: "", years: "", gst: "", cost: "", selling: "", monthly: "", returnRate: "", sipYears: "",
  fixed: "", price: "", variable: "", discount: "", markup: "",
};

const num = (v: string) => Number(v.replace(/,/g, ""));
const valid = (...values: number[]) => values.every((v) => Number.isFinite(v) && v > 0);
const money = (n: number | null) => n !== null && Number.isFinite(n) ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n) : "—";
const pct = (n: number | null) => n !== null && Number.isFinite(n) ? `${n.toFixed(2)}%` : "—";
const whole = (n: number | null) => n !== null && Number.isFinite(n) ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n) : "—";

function Field({ label, value, placeholder, onChange, step = "1" }: { label: string; value: string; placeholder: string; onChange: (v: string) => void; step?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-wrap">
        <input inputMode="decimal" type="number" step={step} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      </div>
    </label>
  );
}

function Result({ label, value, primary = false }: { label: string; value: string; primary?: boolean }) {
  return <div className={`result ${primary ? "primary" : ""}`}><span>{label}</span><strong>{value}</strong></div>;
}

export default function Home() {
  const [active, setActive] = useState("emi");
  const [values, setValues] = useState<Record<Key, string>>(initial);
  const set = (key: Key, value: string) => setValues((p) => ({ ...p, [key]: value }));
  const clear = () => setValues({ ...initial });

  const calc = useMemo(() => {
    const a = num(values.amount), r = num(values.rate), y = num(values.years), g = num(values.gst);
    const c = num(values.cost), s = num(values.selling), m = num(values.monthly), rr = num(values.returnRate), sy = num(values.sipYears);
    const f = num(values.fixed), p = num(values.price), v = num(values.variable), d = num(values.discount), mk = num(values.markup);

    switch (active) {
      case "emi": {
        if (!valid(a, r, y)) return { fields: [["Loan amount (₹)", "amount", "1000000"], ["Interest rate (%)", "rate", "8.5"], ["Tenure (years)", "years", "20"]], results: [["Monthly EMI", money(null), true], ["Total payment", money(null), false], ["Total interest", money(null), false]] };
        const mr = r / 1200, n = y * 12, emi = mr ? a * mr * Math.pow(1 + mr, n) / (Math.pow(1 + mr, n) - 1) : a / n;
        return { fields: [["Loan amount (₹)", "amount", "1000000"], ["Interest rate (%)", "rate", "8.5"], ["Tenure (years)", "years", "20"]], results: [["Monthly EMI", money(emi), true], ["Total payment", money(emi * n), false], ["Total interest", money(emi * n - a), false]] };
      }
      case "salary": {
        const ok = valid(a, r); return { fields: [["Annual CTC (₹)", "amount", "600000"], ["Estimated deductions (%)", "rate", "15"]], results: [["Monthly in-hand", ok ? money(a * (1 - r / 100) / 12) : "—", true], ["Annual estimated in-hand", ok ? money(a * (1 - r / 100)) : "—", false]] };
      }
      case "gst": {
        const ok = valid(a, g); return { fields: [["Base amount (₹)", "amount", "10000"], ["GST rate (%)", "gst", "18"]], results: [["GST amount", ok ? money(a * g / 100) : "—", true], ["Including GST", ok ? money(a * (1 + g / 100)) : "—", false]] };
      }
      case "profit": {
        const ok = valid(c, s); const profit = s - c; return { fields: [["Cost / purchase (₹)", "cost", "100"], ["Selling price (₹)", "selling", "150"]], results: [["Profit / unit", ok ? money(profit) : "—", true], ["Profit margin", ok ? pct((profit / s) * 100) : "—", false]] };
      }
      case "roi": {
        const ok = valid(c, s); const profit = s - c; return { fields: [["Investment (₹)", "cost", "100000"], ["Current value (₹)", "selling", "125000"]], results: [["Profit / loss", ok ? money(profit) : "—", true], ["ROI", ok ? pct((profit / c) * 100) : "—", false]] };
      }
      case "sip": {
        const ok = valid(m, rr, sy); const rate = rr / 1200, n = sy * 12; const future = ok ? m * ((Math.pow(1 + rate, n) - 1) / rate) * (1 + rate) : null; return { fields: [["Monthly SIP (₹)", "monthly", "5000"], ["Expected return (%)", "returnRate", "12"], ["Years", "sipYears", "10"]], results: [["Estimated value", money(future), true], ["Invested amount", ok ? money(m * n) : "—", false], ["Estimated gains", future !== null ? money(future - m * n) : "—", false]] };
      }
      case "compound": {
        const ok = valid(a, r, y); const future = ok ? a * Math.pow(1 + r / 100, y) : null; return { fields: [["Principal (₹)", "amount", "100000"], ["Annual rate (%)", "rate", "10"], ["Years", "years", "10"]], results: [["Future value", money(future), true], ["Interest earned", future !== null ? money(future - a) : "—", false]] };
      }
      case "discount": {
        const ok = valid(a, d); return { fields: [["Original price (₹)", "amount", "10000"], ["Discount (%)", "discount", "20"]], results: [["Discount amount", ok ? money(a * d / 100) : "—", true], ["Final price", ok ? money(a * (1 - d / 100)) : "—", false]] };
      }
      case "markup": {
        const ok = valid(c, mk); return { fields: [["Cost price (₹)", "cost", "100"], ["Markup (%)", "markup", "30"]], results: [["Markup amount", ok ? money(c * mk / 100) : "—", true], ["Selling price", ok ? money(c * (1 + mk / 100)) : "—", false]] };
      }
      default: {
        const ok = valid(f, p, v) && p > v; const units = ok ? f / (p - v) : null; return { fields: [["Fixed costs (₹)", "fixed", "100000"], ["Selling price / unit (₹)", "price", "500"], ["Variable cost / unit (₹)", "variable", "250"]], results: [["Break-even units", units !== null ? whole(units) : "—", true], ["Break-even sales", units !== null ? money(units * p) : "—", false]] };
      }
    }
  }, [active, values]);

  const activeTool = tools.find((t) => t.id === active)!;

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top"><span className="logo">₹</span><span>ProfitCalc <b>India</b></span></a>
        <div className="navlinks"><a href="#calculators">Calculators</a><a href="#why">Why us</a><a href="#faq">FAQ</a></div>
        <a className="nav-cta" href="#calculators">Start free</a>
      </nav>

      <section id="top" className="hero">
        <div className="hero-copy">
          <span className="badge">✦ 100% FREE · MADE FOR INDIA</span>
          <h1>Make numbers<br /><em>make sense.</em></h1>
          <p>Simple, fast calculators for loans, salary, GST, investments and everyday business decisions.</p>
          <div className="hero-actions"><a className="cta" href="#calculators">Explore calculators <span>↓</span></a><span className="trust">No signup · No app · Mobile friendly</span></div>
        </div>
        <div className="hero-card">
          <div className="mini-top"><span>POPULAR TODAY</span><span className="live-dot">● LIVE</span></div>
          <div className="mini-title">EMI Calculator</div>
          <div className="mini-number">₹ 8,678<span>/ month</span></div>
          <div className="mini-bars"><i /><i /><i /><i /><i /></div>
          <div className="mini-bottom"><span>Loan ₹10L</span><span>8.5% · 20 years</span></div>
        </div>
      </section>

      <section id="calculators" className="section">
        <div className="section-head"><div><span className="eyebrow">TOOLS</span><h2>Pick a calculator</h2><p>Enter your numbers below. All fields start blank.</p></div><span className="free-pill">● FREE · NO SIGNUP</span></div>
        <div className="cards">{tools.map((t) => <button key={t.id} onClick={() => setActive(t.id)} className={`tool ${active === t.id ? "selected" : ""}`}><span className="tool-icon">{t.icon}</span><span className="tool-tag">{t.tag}</span><strong>{t.name}</strong><small>{t.desc}</small></button>)}</div>

        <div className="calculator">
          <div className="calc-header"><div><span className="eyebrow">{activeTool.tag.toUpperCase()}</span><h2>{activeTool.name}</h2><p>{activeTool.desc}</p></div><button className="clear" onClick={clear}>Clear all ↺</button></div>
          <div className="calc-body">
            <div className="inputs">{calc.fields.map(([label, key, placeholder]) => <Field key={key} label={label} value={values[key]} placeholder={placeholder} onChange={(v) => set(key, v)} />)}</div>
            <div className="results"><div className="result-head"><span>YOUR ESTIMATE</span><span>Updates instantly</span></div>{calc.results.map(([label, value, primary]) => <Result key={label} label={label as string} value={value as string} primary={Boolean(primary)} />)}</div>
          </div>
          <p className="calc-note">Tip: Delete any value completely and the field stays blank — no unwanted zero.</p>
        </div>
      </section>

      <section id="why" className="why"><div className="why-head"><span className="eyebrow">BUILT FOR EVERYDAY MONEY</span><h2>Clean numbers. Clear decisions.</h2></div><div className="why-grid"><div><b>01</b><h3>India-ready</h3><p>₹, Indian number formatting and practical calculator inputs.</p></div><div><b>02</b><h3>Super simple</h3><p>No complicated forms. Type your numbers and see the estimate.</p></div><div><b>03</b><h3>Mobile first</h3><p>Designed to work comfortably on your phone, wherever you are.</p></div></div></section>

      <section id="faq" className="faq"><span className="eyebrow">FAQ</span><h2>Quick answers.</h2><details><summary>Are these calculators free?</summary><p>Yes. ProfitCalc India is designed for free public use.</p></details><details><summary>Are the results financial advice?</summary><p>No. Results are estimates for planning and educational purposes.</p></details><details><summary>Can I use it on mobile?</summary><p>Yes. The interface is responsive and optimized for mobile screens.</p></details></section>
      <footer><div><span className="logo small">₹</span> © 2026 ProfitCalc India</div><div><a href="#">Privacy</a><span> · </span><a href="#">Terms</a><span> · </span><a href="#">Contact</a></div></footer>
    </main>
  );
}
