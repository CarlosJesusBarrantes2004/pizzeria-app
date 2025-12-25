import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import GlobalUI from "./components/GlobalUI";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Slice & Spark | Premium Pizza Delivery",
  description: "Experience the magic in every slice.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-[#0a0a0a] text-gray-100`}>
        <AppProvider>
          <GlobalUI />
          <main className="pt-20">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
