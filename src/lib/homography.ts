// Homography (proiezione prospettica) da un rettangolo sorgente [0,0]-[w,h] a
// un quadrilatero destinazione arbitrario, espressa come `matrix3d` CSS.
//
// Usata da SfccScreenCard per "incollare" il mini-sito (design 1600×900,
// rettangolo dritto) sullo schermo obliquo dello Studio Display in
// hero2-j5-bg.webp (quadrilatero prospettico, non un rettangolo).
//
// Modello: u = (a*x + b*y + c) / (g*x + i*y + 1)
//          v = (d*x + e*y + f) / (g*x + i*y + 1)
// Per le 4 corrispondenze (0,0)->dest0, (w,0)->dest1, (w,h)->dest2, (0,h)->dest3
// si ottiene un sistema lineare 8x8 in [a,b,c,d,e,f,g,i], risolto con
// eliminazione di Gauss a pivot parziale (nessuna libreria esterna).

export type Point = [number, number];

function solveLinearSystem(A: number[][], bVec: number[]): number[] {
  const n = A.length;
  // Matrice aumentata
  const M = A.map((row, i) => [...row, bVec[i]]);

  for (let col = 0; col < n; col++) {
    // Pivot parziale: riga col valore assoluto massimo in questa colonna.
    let pivotRow = col;
    let maxAbs = Math.abs(M[col][col]);
    for (let r = col + 1; r < n; r++) {
      const abs = Math.abs(M[r][col]);
      if (abs > maxAbs) {
        maxAbs = abs;
        pivotRow = r;
      }
    }
    if (pivotRow !== col) {
      [M[col], M[pivotRow]] = [M[pivotRow], M[col]];
    }

    const pivot = M[col][col];
    if (Math.abs(pivot) < 1e-12) {
      // Sistema degenere: non dovrebbe accadere coi 4 angoli del quad reale.
      continue;
    }

    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = M[r][col] / pivot;
      if (factor === 0) continue;
      for (let c = col; c <= n; c++) {
        M[r][c] -= factor * M[col][c];
      }
    }
  }

  return M.map((row, i) => row[n] / (row[i] || 1));
}

/**
 * Calcola i coefficienti [a,b,c,d,e,f,g,i] dell'omografia che porta il
 * rettangolo (0,0)-(w,h) sui 4 punti destinazione (ordine: TL, TR, BR, BL).
 */
export function computeHomography(
  w: number,
  h: number,
  dest: [Point, Point, Point, Point],
): number[] {
  const src: Point[] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];

  const A: number[][] = [];
  const b: number[] = [];

  for (let k = 0; k < 4; k++) {
    const [x, y] = src[k];
    const [u, v] = dest[k];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }

  return solveLinearSystem(A, b);
}

/**
 * Converte i coefficienti dell'omografia 3x3
 *   H = [[a,b,c],[d,e,f],[g,i,1]]
 * nella stringa CSS `matrix3d(...)` (column-major 4x4).
 */
export function homographyToMatrix3d(coeffs: number[]): string {
  const [a, b, c, d, e, f, g, i] = coeffs;
  const m = [
    a, d, 0, g,
    b, e, 0, i,
    0, 0, 1, 0,
    c, f, 0, 1,
  ];
  return `matrix3d(${m.map((n) => (Number.isFinite(n) ? n : 0)).join(", ")})`;
}

/**
 * Helper di comodo: dato un rettangolo sorgente w×h e 4 punti destinazione in
 * px (TL, TR, BR, BL), ritorna direttamente la stringa `matrix3d(...)`.
 */
export function rectToQuadMatrix3d(
  w: number,
  h: number,
  dest: [Point, Point, Point, Point],
): string {
  return homographyToMatrix3d(computeHomography(w, h, dest));
}
