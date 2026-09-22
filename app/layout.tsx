import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProfitCalc India | Free Financial & Business Calculators",
  description: "Free EMI, SIP, GST, salary, ROI, profit, property and business calculators for India.",
  keywords: ["EMI calculator India","salary calculator","GST calculator","SIP calculator","business profit calculator","ROI calculator"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
