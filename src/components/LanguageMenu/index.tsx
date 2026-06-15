import { useEffect, useMemo, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { langChange } from "../../utils/language_Utils";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../hooks";
import { languageUpdated } from "../../features/searchSlice";
import { useSelector } from "react-redux";
import { RootState } from "../..";
import Modal from "@mui/material/Modal";

const ALL_LANGUAGES = [
  { key: "de", nativeName: "Deutsch" },
  { key: "en", nativeName: "English" },
  { key: "fr", nativeName: "Français" },
  { key: "it", nativeName: "Italiano" },
  { key: "sl", nativeName: "Slovenščina" },
];

function LanguageMenu() {
  const { i18n } = useTranslation();
  const reduxLanguage = useSelector(
    (state: RootState) => state.search.language,
  );
  const dispatch = useAppDispatch();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const activeLanguage = i18n.resolvedLanguage ?? "de";

  // Active language first, rest sorted alphabetically.
  const sortedLanguages = useMemo(() => {
    const others = ALL_LANGUAGES.filter((l) => l.key !== activeLanguage).sort(
      (a, b) => a.key.localeCompare(b.key),
    );
    const active = ALL_LANGUAGES.find((l) => l.key === activeLanguage);
    return active ? [active, ...others] : others;
  }, [activeLanguage]);

  // Sync i18next resolved language into Redux on mount. Covers sessions without
  // a ?lang= URL param, which SearchParamSync would otherwise miss.
  useEffect(() => {
    if (!reduxLanguage) {
      dispatch(languageUpdated(activeLanguage));
    }
  }, []);

  const setLanguage = (lng: string) => {
    langChange(lng);
    setShowLanguageMenu(false);
    dispatch(languageUpdated(lng));
  };

  // Compute dropdown position anchored to trigger's right edge
  const getDropdownPosition = (): React.CSSProperties => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      return {
        position: "absolute" as const,
        right: window.innerWidth - rect.right,
        top: rect.top,
      };
    }
    return { position: "absolute" as const, right: 30, top: 15 };
  };

  return (
    <div>
      <span
        className="languageIcon centerMe"
        ref={triggerRef}
        onClick={() => {
          setShowLanguageMenu(!showLanguageMenu);
        }}
      >
        <img
          src={`https://cdn.zuugle.at/img/langIcon.png`}
          height={"23px"}
          width={"23px"}
          alt="Change Language here"
        />
      </span>
      {showLanguageMenu && (
        <Modal
          open={showLanguageMenu}
          onClose={() => setShowLanguageMenu(false)}
        >
          <div
            className="languageMenu"
            style={{
              ...getDropdownPosition(),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              className="rowing"
              style={{
                width: "100%",
                marginBottom: -30,
                paddingRight: 10,
                paddingTop: 5,
              }}
            >
              <div />{" "}
              <span
                className="closeIcon pointy"
                style={{ zIndex: 1 }}
                onClick={() => setShowLanguageMenu(false)}
              >
                <CloseIcon
                  sx={{
                    color: "#8B8B8B",
                    width: 18,
                    height: 18,
                  }}
                />
              </span>
            </div>
            <div className="languageOptions">
              {sortedLanguages.map((item) => (
                <span
                  className="languageItem"
                  onClick={() => setLanguage(item.key)}
                  key={item.key}
                  style={{
                    width: 140,
                    marginBottom: 5,
                    color: activeLanguage === item.key ? "#254980" : undefined,
                  }}
                >
                  {item.nativeName}
                </span>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
export default LanguageMenu;
