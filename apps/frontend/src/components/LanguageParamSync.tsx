import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useAppDispatch } from "../hooks";
import { languageUpdated } from "../features/searchSlice";
import { langChange } from "../utils/language_Utils";
import i18n from "../translations/i18n";

/**
 * Reads the ?lang= query parameter on mount and bootstraps Redux + i18n.
 *
 * The reverse direction (Redux → URL) is handled exclusively by
 * SearchParamSync, which rebuilds the entire query string from Redux state.
 * Writing lang here via setParams would conflict: the functional-update
 * pattern (prev => ...) re-introduces stale values for params owned by
 * SearchParamSync (e.g. city), causing an infinite oscillation loop.
 */
export default function LanguageParamSync() {
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();

  // URL → Redux + i18n on mount (handles navigating to a page with ?lang= in the URL)
  useEffect(() => {
    const lang = params.get("lang");
    if (lang) {
      dispatch(languageUpdated(lang));
      if (lang !== i18n.resolvedLanguage) langChange(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
