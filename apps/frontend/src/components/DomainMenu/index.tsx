import { useEffect, useRef, useState } from "react";
import { getDomainText } from "../../utils/globals";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";
import { store } from "../..";
import { useAppDispatch } from "../../hooks";
import { languageUpdated } from "../../features/searchSlice";
import { langChange } from "../../utils/language_Utils";
import LegalDialog, { type LegalDialogType } from "../LegalDialog/LegalDialog";
import { assetUrl } from "../../utils/assetUrl";
import {
  ZUUGLE_COUNTRIES,
  type ZuugleCountry,
  getCountryHost,
  getDomainName,
} from "../../utils/domains";

const ALL_LANGUAGES = [
  { key: "de", nativeName: "Deutsch" },
  { key: "en", nativeName: "English" },
  { key: "fr", nativeName: "Français" },
  { key: "it", nativeName: "Italiano" },
  { key: "sl", nativeName: "Slovenščina" },
];

const toDomainEntry = (country: ZuugleCountry, uat: boolean) => {
  const host = getCountryHost(country, uat);
  return {
    name: getDomainName(country, uat),
    url: `https://${host}`,
    key: host,
  };
};

const PROD_DOMAINS = ZUUGLE_COUNTRIES.map((c) => toDomainEntry(c, false));

const UAT_DOMAINS = ZUUGLE_COUNTRIES.filter((c) => c.hasUat).map((c) =>
  toDomainEntry(c, true),
);

// Development domain
const DEV_DOMAIN = {
  name: "Localhost",
  url: "http://localhost:3000",
  key: "localhost:3000",
};

// Map to find which domain list and starting index
const DOMAIN_CONFIG: Record<
  string,
  { domainList: typeof PROD_DOMAINS; domain: string }
> = {
  "localhost:3000": {
    domainList: [DEV_DOMAIN, ...PROD_DOMAINS],
    domain: "http://localhost:3000",
  },
  ...Object.fromEntries(
    PROD_DOMAINS.map((d) => [
      d.key,
      { domainList: PROD_DOMAINS, domain: d.url },
    ]),
  ),
  ...Object.fromEntries(
    UAT_DOMAINS.map((d) => [d.key, { domainList: UAT_DOMAINS, domain: d.url }]),
  ),
};

function DomainMenu() {
  const host = window.location.href;
  const triggerRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const activeLanguage = i18n.resolvedLanguage ?? "de";

  // Find matching domain configuration and reorder with current domain first
  const getDomainsForHost = (
    hostUrl: string,
  ): {
    domain: string;
    listOfDomains: { id: number; name: string; url: string }[];
  } => {
    // Check each domain in config
    for (const [key, config] of Object.entries(DOMAIN_CONFIG)) {
      if (hostUrl.indexOf(key) >= 0) {
        const currentDomainIndex = config.domainList.findIndex(
          (d) => hostUrl.indexOf(d.key) >= 0,
        );
        const reorderedDomains =
          currentDomainIndex > 0
            ? [
                ...config.domainList.slice(currentDomainIndex),
                ...config.domainList.slice(0, currentDomainIndex),
              ]
            : config.domainList;

        return {
          domain: config.domain,
          listOfDomains: reorderedDomains.map((d, index) => ({
            id: index,
            name: d.name,
            url: d.url,
          })),
        };
      }
    }

    // Default fallback
    return {
      domain: "www.zuugle.at",
      listOfDomains: PROD_DOMAINS.map((d, index) => ({
        id: index,
        name: d.name,
        url: d.url,
      })),
    };
  };

  const { listOfDomains } = getDomainsForHost(host);

  const secondMenu: { id: number; name: string; type: LegalDialogType }[] = [
    { id: 1, name: t("start.impressum"), type: "imprint" },
    { id: 2, name: t("start.datenschutz"), type: "privacy" },
  ];
  const [showDomainMenu, setShowDomainMenu] = useState(false);
  const [legalDialog, setLegalDialog] = useState<LegalDialogType>(null);

  // Keep Redux language in sync even without a ?lang= param. Moved here from
  // the old standalone language menu, which no longer renders in the header.
  // Reads the store directly instead of subscribing via useSelector, since
  // this only needs to run once on mount.
  useEffect(() => {
    if (!store.getState().search.language) {
      dispatch(languageUpdated(activeLanguage));
    }
  }, []);

  const setLanguage = (lng: string) => {
    langChange(lng);
    setShowDomainMenu(false);
    dispatch(languageUpdated(lng));
  };

  // Compute dropdown position from trigger element
  const getDropdownPosition = (): React.CSSProperties => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      return {
        position: "absolute" as const,
        left: rect.left,
        top: rect.top,
      };
    }
    return { position: "absolute" as const, left: 20, top: 15 };
  };

  return (
    <Box component={"div"} className="colLeft">
      <Box
        ref={triggerRef}
        onClick={() => setShowDomainMenu(true)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          height: 40,
          px: "18px",
          bgcolor: "rgba(255, 255, 255, 0.15)",
          borderRadius: "50px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          "&:hover": { bgcolor: "rgba(255, 255, 255, 0.28)" },
        }}
      >
        <img
          src={assetUrl("/img/zuugle_weiss.svg")}
          height="19"
          width="34"
          alt="Logo Zuugle"
        />
        <Typography
          sx={{
            fontSize: "15.4px",
            color: "#fff",
            lineHeight: "21px",
          }}
        >
          {getDomainText()}
        </Typography>
        <KeyboardArrowDownIcon sx={{ width: 20, color: "#fff" }} />
      </Box>
      {showDomainMenu && (
        <Modal
          onClose={() => setShowDomainMenu(false)}
          open={showDomainMenu}
          style={{ outline: "none", border: "none" }}
        >
          <div className="domainMenu colCenteral" style={getDropdownPosition()}>
            {listOfDomains.map((item, i) =>
              i === 0 ? (
                <div
                  className="rowing"
                  key={item.id}
                  style={{
                    paddingTop: 12,
                    paddingBottom: 12,
                    justifyContent: "flex-start",
                  }}
                >
                  <img
                    className="pointy"
                    src={assetUrl("/img/zuugle.svg")}
                    height={"19px"}
                    width={"auto"}
                    alt="Logo Zuugle"
                    onClick={() => {
                      setShowDomainMenu(false);
                      window.location.replace(item.url);
                    }}
                  />
                  <span
                    className="domainItem pointy"
                    onClick={() => {
                      setShowDomainMenu(false);
                      window.location.replace(item.url);
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    className="closeIcon pointy"
                    onClick={() => setShowDomainMenu(false)}
                  >
                    <KeyboardArrowUpIcon
                      sx={{ color: "#8B8B8B", width: 20, height: 20 }}
                    />
                  </span>
                </div>
              ) : (
                <span
                  className="domainItem pointy"
                  key={item.id}
                  style={{ paddingTop: 12, paddingBottom: 12 }}
                  onClick={() => {
                    setShowDomainMenu(false);
                    window.location.replace(item.url);
                  }}
                >
                  {item.name}
                </span>
              ),
            )}
            <span className="horizontalBar" />
            {/* Language selection – a globe label keeps it discoverable now
                that the standalone language icon is gone. */}
            <span
              className="domainItem"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                paddingBottom: 10,
              }}
            >
              <LanguageOutlinedIcon sx={{ fontSize: 18 }} />
              {t("filter.sprache")}
            </span>
            {ALL_LANGUAGES.map((lang) => (
              <span
                className="domainItem pointy"
                key={lang.key}
                style={{
                  paddingTop: 6,
                  paddingBottom: 6,
                  color:
                    activeLanguage === lang.key
                      ? "var(--bzb-bahnblau)"
                      : undefined,
                  fontWeight: activeLanguage === lang.key ? 700 : undefined,
                }}
                onClick={() => setLanguage(lang.key)}
              >
                {lang.nativeName}
              </span>
            ))}
            <span className="horizontalBar" />
            {secondMenu.map((item) => (
              <span
                key={item.id}
                className="domainItem pointy"
                style={{
                  paddingTop: item.id === 0 ? 0 : 12,
                  paddingBottom: 12,
                }}
                onClick={() => {
                  setShowDomainMenu(false);
                  setLegalDialog(item.type);
                }}
              >
                {item.name}
              </span>
            ))}
          </div>
        </Modal>
      )}
      <LegalDialog open={legalDialog} onClose={() => setLegalDialog(null)} />
    </Box>
  );
}

export default DomainMenu;
