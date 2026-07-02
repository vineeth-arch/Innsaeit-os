// Straight-tuck box dieline math — pure geometry, no dependency.
// Standard RSC/tuck-style layout: flat width = 2*(L+W), flat height = H + 2*(top+bottom flaps).
// Flaps sized as W/2 (industry-common rule of thumb for tuck-in flaps).

export type DielineInput = {
  lengthMm: number; // front panel width
  widthMm: number; // side panel width (depth)
  heightMm: number;
};

export type DielineResult = {
  panels: { front: number; side: number; back: number; height: number };
  glueFlapMm: number;
  topFlapMm: number;
  bottomFlapMm: number;
  flatWidthMm: number;
  flatHeightMm: number;
};

export function calculateDieline({ lengthMm, widthMm, heightMm }: DielineInput): DielineResult {
  // Glue flap: ~15-20mm is typical for small-to-mid cartons; scale gently with size.
  const glueFlapMm = Math.max(15, Math.round(widthMm * 0.3));
  const flapMm = Math.round(widthMm / 2);

  const flatWidthMm = 2 * (lengthMm + widthMm) + glueFlapMm;
  const flatHeightMm = heightMm + 2 * flapMm;

  return {
    panels: { front: lengthMm, side: widthMm, back: lengthMm, height: heightMm },
    glueFlapMm,
    topFlapMm: flapMm,
    bottomFlapMm: flapMm,
    flatWidthMm,
    flatHeightMm,
  };
}
