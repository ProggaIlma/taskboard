import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskBoard",
  description: "A simple task management board",
};

const THEME_INIT_SCRIPT = `
  try {
    var stored = localStorage.getItem("taskboard-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Runs before paint so the correct theme applies immediately, no flash */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
