import type { Metadata } from "next";
import { taskoGeistSans, taskoGeistMono } from "@/fonts/tasko-fonts";
import "./tasko.css";

// Layout della route /projects/tasko: qui vive la dashboard "vera" che il
// mock-agnostico della card 5 anticipa. Isolato dal portfolio (route group
// (portfolio) non carica qui): niente scroll a schede, solo il wrapper
// `.tasko-root` con le 2 CSS variable dei font Geist (vedi tasko-fonts.ts +
// tasko.css), stesso pattern di bistro.css/sfcc.css. Tema light fisso:
// niente ThemeProvider/next-themes (il template originale ha anche un tema
// dark, qui volutamente non portato).
export const metadata: Metadata = {
  title: "Tasko — Project management dashboard",
  description:
    "Plan, prioritize, and accomplish your tasks with ease. Dashboard demo (Tasko template).",
};

export default function TaskoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`tasko-root antialiased ${taskoGeistSans.variable} ${taskoGeistMono.variable}`}
    >
      {children}
    </div>
  );
}
