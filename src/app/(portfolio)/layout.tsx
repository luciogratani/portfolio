// Route group (portfolio): raccoglie l'esperienza portfolio servita su "/".
// Le import CSS globali del portfolio vivono QUI e non nel root layout: in App
// Router un CSS importato in un layout carica solo per le route sotto quel
// layout, quindi queste regole (body/cursor custom, overflow:clip su main…)
// restano confinate al portfolio e non interferiscono con /projects/gigi.
import "../underlay-nav.css";
import "../crisp-hero.css";
import "../sections.css";
import "../demo-site.css";
import "../sfcc-demo-site.css";
import "../bistro-demo-site.css";
import "../tasko-demo-site.css";
import "../g3-demo-site.css";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
