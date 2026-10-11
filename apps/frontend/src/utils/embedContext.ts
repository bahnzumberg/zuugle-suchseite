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
}

const defaultConfig: EmbedConfig = {
  isEmbed: false,
  fixedProviders: [],
  externalLinks: false,
};

export const EmbedContext = createContext<EmbedConfig>(defaultConfig);

export function useEmbed(): EmbedConfig {
  return useContext(EmbedContext);
}
