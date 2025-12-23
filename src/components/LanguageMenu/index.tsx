import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { langChange } from "../../utils/language_Utils";
import { Modal } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../hooks";
import { languageUpdated } from "../../features/searchSlice";
import { useSelector } from "react-redux";
import { RootState } from "../..";

function LanguageMenu() {
  const { i18n } = useTranslation();

  const resolvedLanguage = i18n.language;
  const storedLanguage = localStorage.getItem("lang");
  const reduxLanguage = useSelector(
    (state: RootState) => state.search.language,
  );
  const [languages] = useState([
    { key: "en", nativeName: "English" },
    { key: "fr", nativeName: "Français" },
    { key: "de", nativeName: "Deutsch" },
    { key: "it", nativeName: "Italiano" },
    { key: "sl", nativeName: "Slovenščina" },
  ]);

  const dispatch = useAppDispatch();

  const setLanguage = (lng: string) => {
    localStorage.setItem("lang", lng);
    langChange(lng);
    setShowLanguageMenu(false);
    dispatch(languageUpdated(lng));
  };

  useEffect(() => {
    const currLanguage = reduxLanguage || storedLanguage || resolvedLanguage;
    let currIndex = 0;
    if (currLanguage) {
      currIndex = languages.findIndex((lang) => lang.key === currLanguage);
    }
    const [langObject] = languages.splice(currIndex, 1);
    languages.sort((a, b) => a.key.localeCompare(b.key));
    languages.unshift(langObject);
    setLanguage(currLanguage);
  }, [reduxLanguage]);

  const i18LangFormatted = i18n.services.languageUtils.formatLanguageCode(
    i18n.language,
  );
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  return (
    <div>
      <span
        className="languageIcon centerMe"
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              className="rowing"
              style={{ width: "100%", marginBottom: -15 }}
            >
              <div />{" "}
              <span
                className="closeIcon pointy"
                onClick={() => setShowLanguageMenu(false)}
                style={{ marginRight: 5 }}
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
              {languages.map((item) => (
                <span
                  className="languageItem"
                  onClick={() => setLanguage(item.key)}
                  key={item.key}
                  style={{
                    width: 140,
                    marginBottom: 5,
                    color:
                      i18LangFormatted === item.key ? "#4992FF" : undefined,
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
