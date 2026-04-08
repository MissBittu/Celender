import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wall Calendar — Interactive Planning",
  description: "A premium interactive wall calendar component with date range selection, notes, and beautiful design.",
  keywords: ["calendar", "planning", "date picker", "interactive", "wall calendar"],
  authors: [{ name: "Wall Calendar App" }],
  openGraph: {
    title: "Interactive Wall Calendar",
    description: "Plan your days beautifully with our interactive wall calendar",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1b1c4d" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
