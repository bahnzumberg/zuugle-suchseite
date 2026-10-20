import { createContext, useContext } from "react";

/**
 * Configuration for the embed widget.
 *
 * When `isEmbed` is true, components can opt out of behaviours that don't
 * belong in the embedded context (e.g. hide Header/Footer, CookieBanner,
 * DomainMenu, Favorites, provider filter).
 *
 * The fixed providers array is merged into every API request by the embed
 * entry point so the backend only returns tours from these providers.
 */
export interface EmbedConfig {
  /** True when rendering inside the embed widget. */
  isEmbed: boolean;
  /**
   * Provider slugs that are always applied and hidden from the filter UI.
   * When set, the providers CheckboxFilterSection is not rendered.
   */
  fixedProviders: string[];
  /**
   * When true, tour card links point to the provider's own website
   * (e.g. bahn-zum-berg.at) instead of the internal /tour/ detail pages.
   */
  externalLinks: boolean;
  /**
   * Top offset in pixels for the sticky search bar (e.g. to fit below a host header).
   */
  stickyTop: number;
  /**
   * When true, synchronizes search/filter parameters with host page query params.
   */
  syncUrl: boolean;
  /**
   * Target Zuugle domain (e.g. www.zuugle.at, www.zuugle.de, www2.zuugle.at).
   */
  domain: string;
}

const defaultConfig: EmbedConfig = {
  isEmbed: false,
  fixedProviders: [],
  externalLinks: false,
  stickyTop: 0,
  syncUrl: false,
  domain: "www.zuugle.at",
};

export const EmbedContext = createContext<EmbedConfig>(defaultConfig);

export function useEmbed(): EmbedConfig {
  return useContext(EmbedContext);
}
