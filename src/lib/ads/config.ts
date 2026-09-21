/**
 * Ad configuration.
 *
 * Every id comes from the environment. Nothing renders unless a real publisher
 * id and a real numeric slot id are both present, so a misconfigured deploy
 * shows no ads at all rather than empty grey boxes — which is both better for
 * the reader and safer under AdSense's policy on pages with no valid inventory.
 */

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '';

/**
 * Placements, named for where they sit rather than what size they are.
 *
 * Each maps to one ad unit created in the AdSense dashboard. Leave a variable
 * unset and that placement simply does not render.
 */
export const AD_SLOTS = {
  /** Between content sections on the homepage and category pages. */
  inFeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_FEED ?? '',
  /** After the article or FAQ content, before the footer. */
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ?? '',
  /** Desktop sidebar on tool pages, below the related-tools list. */
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? '',
  /** Inside a blog post, between paragraphs. */
  inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE ?? '',
} as const;

export type AdPlacement = keyof typeof AD_SLOTS;

export const adsConfigured = () => ADSENSE_CLIENT.startsWith('ca-pub-');

export const slotConfigured = (placement: AdPlacement) =>
  adsConfigured() && AD_SLOTS[placement].length > 0;

/**
 * Reserved heights, in px, per breakpoint.
 *
 * The space is held before the ad arrives so nothing below it moves — an ad
 * that shoves the page down as you reach for a button is the single most
 * irritating pattern on an ad-supported site, and it wrecks Cumulative Layout
 * Shift. Responsive units are allowed to fill the box but never to resize it.
 */
export const AD_SIZES: Record<AdPlacement, { mobile: number; desktop: number }> = {
  inFeed: { mobile: 250, desktop: 90 },
  footer: { mobile: 250, desktop: 250 },
  sidebar: { mobile: 0, desktop: 600 },
  inArticle: { mobile: 250, desktop: 250 },
};
