 "use client";
import { useMemo, useState } from "react";

const tools = [
  ["EMI Calculator","Loan monthly payment","₹","emi"],
  ["Salary Calculator","Estimate in-hand salary","₹","salary"],
  ["GST Calculator","Add or remove GST","%","gst"],
  ["Profit Margin","Profit & margin","%","profit"],
  ["ROI Calculator","Investment return","%","roi"],
  ["SIP Calculator","Monthly SIP value","₹","sip"],
  ["Compound Interest","Growth over time","₹","compound"],
  ["Discount Calculator","Final sale price","%","discount"],
  ["Markup Calculator","Selling price & markup","%","markup"],
  ["Break-even Calculator","Units to recover cost","₹","break"],
];

const fmt=(n:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(isFinite(n)?n:0);

function Field({label,value,setValue,step="1"}:{label:string,value:number,setValue:(n:number)=>void,step?:string}){
 return <label className="field"><span>{label}</span><input type="number" step={step} value={value} onChange={e=>setValue(Number(e.target.value))}/></label>
}
function Result({label,value}:{label:string,value:string}){return <div className="result"><span>{label}</span><strong>{value}</strong></div>}

export default function Home(){
 const [active,setActive]=useState("emi");
 const [amount,setAmount]=useState(1000000),[rate,setRate]=useState(8.5),[years,setYears]=useState(20);
 const [gst,setGst]=useState(18),[cost,setCost]=useState(100),[selling,setSelling]=useState(150);
 const [monthly,setMonthly]=useState(5000),[returnRate,setReturnRate]=useState(12),[sipYears,setSipYears]=useState(10);
 const [fixed,setFixed]=useState(100000),[price,setPrice]=useState(500),[variable,setVariable]=useState(250);
 const [discount,setDiscount]=useState(20),[markup,setMarkup]=useState(30);

 const emi=useMemo(()=>{const r=rate/1200,n=years*12;return r?amount*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):amount/n},[amount,rate,years]);
 const sip=useMemo(()=>{const r=returnRate/1200,n=sipYears*12;return monthly*((Math.pow(1+r,n)-1)/r)*(1+r)},[monthly,returnRate,sipYears]);
 const ci=useMemo(()=>amount*Math.pow(1+rate/100,years),[amount,rate,years]);

 function calc(){
  switch(active){
   case"emi":return <><Field label="Loan amount (₹)" value={amount} setValue={setAmount}/><Field label="Interest rate (%)" value={rate} setValue={setRate} step="0.1"/><Field label="Tenure (years)" value={years} setValue={setYears}/><Result label="Monthly EMI" value={fmt(emi)}/><Result label="Total payment" value={fmt(emi*years*12)}/><Result label="Total interest" value={fmt(emi*years*12-amount)}/></>;
   case"salary":return <><Field label="Annual CTC (₹)" value={amount} setValue={setAmount}/><Field label="Estimated deductions (%)" value={rate} setValue={setRate} step="0.1"/><Result label="Estimated monthly in-hand" value={fmt(amount*(1-rate/100)/12)}/><p className="note">Estimate only. Actual in-hand depends on PF, tax regime, bonus and salary structure.</p></>;
   case"gst":return <><Field label="Base amount (₹)" value={amount} setValue={setAmount}/><Field label="GST rate (%)" value={gst} setValue={setGst}/><Result label="GST amount" value={fmt(amount*gst/100)}/><Result label="Including GST" value={fmt(amount*(1+gst/100))}/></>;
   case"profit":return <><Field label="Cost / purchase (₹)" value={cost} setValue={setCost}/><Field label="Selling price (₹)" value={selling} setValue={setSelling}/><Result label="Profit / unit" value={fmt(selling-cost)}/><Result label="Margin" value={`${selling?((selling-cost)/selling*100).toFixed(2):0}%`}/></>;
   case"roi":return <><Field label="Investment (₹)" value={cost} setValue={setCost}/><Field label="Current value (₹)" value={selling} setValue={setSelling}/><Result label="Profit / loss" value={fmt(selling-cost)}/><Result label="ROI" value={`${cost?((selling-cost)/cost*100).toFixed(2):0}%`}/></>;
   case"sip":return <><Field label="Monthly SIP (₹)" value={monthly} setValue={setMonthly}/><Field label="Expected return (%)" value={returnRate} setValue={setReturnRate} step="0.1"/><Field label="Years" value={sipYears} setValue={setSipYears}/><Result label="Estimated value" value={fmt(sip)}/><Result label="Invested amount" value={fmt(monthly*sipYears*12)}/></>;
   case"compound":return <><Field label="Principal (₹)" value={amount} setValue={setAmount}/><Field label="Annual rate (%)" value={rate} setValue={setRate} step="0.1"/><Field label="Years" value={years} setValue={setYears}/><Result label="Future value" value={fmt(ci)}/><Result label="Interest earned" value={fmt(ci-amount)}/></>;
   case"discount":return <><Field label="Original price (₹)" value={amount} setValue={setAmount}/><Field label="Discount (%)" value={discount} setValue={setDiscount}/><Result label="Discount amount" value={fmt(amount*discount/100)}/><Result label="Final price" value={fmt(amount*(1-discount/100))}/></>;
   case"markup":return <><Field label="Cost price (₹)" value={cost} setValue={setCost}/><Field label="Markup (%)" value={markup} setValue={setMarkup}/><Result label="Markup amount" value={fmt(cost*markup/100)}/><Result label="Selling price" value={fmt(cost*(1+markup/100))}/></>;
   case"break":return <><Field label="Fixed costs (₹)" value={fixed} setValue={setFixed}/><Field label="Selling price / unit (₹)" value={price} setValue={setPrice}/><Field label="Variable cost / unit (₹)" value={variable} setValue={setVariable}/><Result label="Break-even units" value={fmt((fixed/(price-variable))||0)}/><Result label="Break-even sales" value={fmt((fixed/(price-variable))*price)}/></>;
  }
 }

 return <main>
  <nav className="nav"><div className="brand">◈ ProfitCalc <b>India</b></div><div className="navlinks"><a href="#calculators">Calculators</a><a href="#faq">FAQ</a><a href="#about">About</a></div></nav>
  <section className="hero"><span className="badge">🇮🇳 FREE • MADE FOR INDIA</span><h1>Calculate before<br/><em>you invest.</em></h1><p>Fast, simple calculators for loans, salary, investments and small business decisions.</p><a className="cta" href="#calculators">Start calculating ↓</a></section>
  <section id="calculators" className="section"><div className="section-head"><div><span className="eyebrow">TOOLS</span><h2>Popular calculators</h2></div><span className="muted">Free • No signup</span></div>
   <div className="cards">{tools.map(t=><button key={t[3]} onClick={()=>setActive(t[3])} className={`tool ${active===t[3]?"selected":""}`}><span className="tool-icon">{t[2]}</span><strong>{t[0]}</strong><small>{t[1]}</small></button>)}</div>
   <div className="calculator"><span className="eyebrow">CALCULATOR</span><h2>{tools.find(t=>t[3]===active)?.[0]}</h2><div className="calc-grid">{calc()}</div></div>
  </section>
  <section className="info" id="about"><div><span className="eyebrow">COMING NEXT</span><h2>More India-focused tools.</h2><p className="muted">Home loan, property ROI, car rental profit, petrol pump, inflation and business calculators.</p></div><div className="chips">{["Home Loan","Property ROI","Car Rental","Petrol Pump","Inflation","Business ROI"].map(x=><span key={x}>{x}</span>)}</div></section>
  <section id="faq" className="faq"><span className="eyebrow">FAQ</span><h2>Simple answers.</h2><details><summary>Are these calculators free?</summary><p>Yes. The calculators are designed for free public use.</p></details><details><summary>Are the results financial advice?</summary><p>No. Results are estimates for educational and planning purposes.</p></details><details><summary>Can I use this on mobile?</summary><p>Yes. The design is responsive and optimized for mobile screens.</p></details></section>
  <footer><div>© 2026 ProfitCalc India</div><div><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Contact</a></div></footer>
 </main>
}
