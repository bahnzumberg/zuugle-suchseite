import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { langChange } from "../../utils/language_Utils";
import { Modal } from "@mui/material";
import { useTranslation } from "react-i18next";

function LanguageMenu({ pageKey }) {
  const { i18n } = useTranslation();

  var resolvedLanguage = i18n.language;
  const storedLanguage = localStorage.getItem("lang");
  let currLanguage = storedLanguage || resolvedLanguage;
  const [Languages, setLanguages] = useState([
    { key: "en", nativeName: "English" },
    { key: "fr", nativeName: "Français" },
    { key: "de", nativeName: "Deutsch" },
    { key: "it", nativeName: "Italiano" },
    { key: "sl", nativeName: "Slovenščina" },
  ]);

  useEffect(() => {
    let currIndex = null;
    if (!!currLanguage) {
      currIndex = Languages.findIndex((lang) => lang.key === currLanguage);
    }
    const [langObject] = Languages.splice(currIndex, 1);
    Languages.sort((a, b) => a.key.localeCompare(b.key));
    Languages.unshift(langObject);
  }, [currLanguage, Languages]);

  const i18LangFormatted = i18n.services.languageUtils.formatLanguageCode(
    i18n.language,
  );
  const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
  const setLanguage = (lng) => {
    localStorage.setItem("lang", lng);
    langChange(lng);
    setShowLanguageMenu(false);
    if (pageKey === "main" || pageKey === "start") {
      window.location.reload();
    }
  };

  return (
    <div>
      <span
        className="languageIcon centerMe"
        onClick={() => {
          setShowLanguageMenu(!showLanguageMenu);
        }}
      >
        <img
          src={`/app_static/img/langIcon.png`}
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
              {Languages.map((item) => (
                <span
                  className="languageItem"
                  onClick={() => setLanguage(item.key)}
                  key={item.key}
                  style={{
                    width: 140,
                    marginBottom: 5,
                    color: i18LangFormatted === item.key && "#4992FF",
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
