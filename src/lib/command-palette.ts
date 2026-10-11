export const OPEN_PALETTE_EVENT = "command-palette:open";

/** Lets any client component open the palette without shared state. */
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}
