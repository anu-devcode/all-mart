import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CustomerAccountProvider } from "@/components/providers/CustomerAccountProvider";
import { AllMartProvider } from "@/components/providers/AllMartProvider";
import { RouteChrome } from "@/components/RouteChrome";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "All Mart Digital Retail",
  description: "Frontend prototype for the All Mart Digital Retail Platform.",
  icons: {
    icon: [{ url: "/assets/logo.png", type: "image/png" }],
    apple: [{ url: "/assets/logo.png", type: "image/png" }],
    shortcut: ["/assets/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full max-w-full overflow-x-clip antialiased`} data-scroll-behavior="smooth">
      <body className="flex min-h-full w-full max-w-full flex-col overflow-x-clip font-[family-name:var(--font-poppins)]">
        <AuthProvider>
          <CustomerAccountProvider>
            <AllMartProvider>
              <RouteChrome>{children}</RouteChrome>
            </AllMartProvider>
          </CustomerAccountProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
