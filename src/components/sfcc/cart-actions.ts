"use server";

// Stub SDK-free delle server action del carrello. Nella demo il carrello è
// interamente client-side (reducer nel CartProvider), quindi l'unica action
// ancora referenziata è il checkout, qui no-op (nessun backend/redirect reale).
export async function redirectToCheckout(): Promise<void> {
  // no-op: checkout non disponibile nella demo mock.
}
