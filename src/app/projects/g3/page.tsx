import G3App from "@/components/g3/app/G3App";

// Route /projects/g3: renderizza l'app gestionale (shell + sezioni con switch
// client-side). Tutto il resto (dati, tema, navigazione tra sezioni) vive in
// G3App e nei pannelli sotto components/g3/app/panels.
export default function G3Page() {
  return <G3App />;
}
