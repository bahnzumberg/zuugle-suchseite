import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "..";
import { useAppDispatch } from "../hooks";
import { languageUpdated } from "../features/searchSlice";

export default function LanguageParamSync() {
  const language = useSelector((state: RootState) => state.search.language);
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();

  // URL → Redux on mount (handles navigating to a page with ?lang= in the URL)
  useEffect(() => {
    const lang = params.get("lang");
    if (lang) dispatch(languageUpdated(lang));
  }, []);

  // Redux → URL whenever language changes
  useEffect(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (language) next.set("lang", language);
        else next.delete("lang");
        return next;
      },
      { replace: true },
    );
  }, [language]);

  return null;
}
