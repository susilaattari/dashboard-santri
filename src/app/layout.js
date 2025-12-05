import "./globals.css";
import LayoutPage from "./LayoutPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Dashboard Mutaba'ah",
  description: "Manajemen Data Hafalan Santri",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="id">
      <body className={`font-sans antialiased`}>
        <LayoutPage session={session}>{children}</LayoutPage>
      </body>
    </html>
  );
}
