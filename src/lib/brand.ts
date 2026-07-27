/** Brand logo defaults — safe for client + server (no mongoose). */

export type SiteBrandLogos = {
  id: "brand";
  headerLogo: string;
  footerLogo: string;
  introLogo: string;
};

export const defaultSiteBrand: SiteBrandLogos = {
  id: "brand",
  headerLogo: "/images/brand/logo.png",
  footerLogo: "/images/brand/intro-logo.png",
  introLogo: "/images/brand/intro-logo.png",
};
