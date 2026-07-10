import { useRef, useState } from "react";
import { getDomainText } from "../../utils/globals";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";
import LegalDialog, { type LegalDialogType } from "../LegalDialog/LegalDialog";

// All production domains
const PROD_DOMAINS = [
  { name: "Zuugle.at", url: "https://www.zuugle.at", key: "www.zuugle.at" },
  { name: "Zuugle.ch", url: "https://www.zuugle.ch", key: "www.zuugle.ch" },
  { name: "Zuugle.de", url: "https://www.zuugle.de", key: "www.zuugle.de" },
  { name: "Zuugle.fr", url: "https://www.zuugle.fr", key: "www.zuugle.fr" },
  { name: "Zuugle.it", url: "https://www.zuugle.it", key: "www.zuugle.it" },
  { name: "Zuugle.li", url: "https://www.zuugle.li", key: "www.zuugle.li" },
  { name: "Zuugle.si", url: "https://www.zuugle.si", key: "www.zuugle.si" },
];

// All UAT domains
const UAT_DOMAINS = [
  {
    name: "UAT Zuugle.at",
    url: "https://www2.zuugle.at",
    key: "www2.zuugle.at",
  },
  {
    name: "UAT Zuugle.ch",
    url: "https://www2.zuugle.ch",
    key: "www2.zuugle.ch",
  },
  {
    name: "UAT Zuugle.de",
    url: "https://www2.zuugle.de",
    key: "www2.zuugle.de",
  },
  {
    name: "UAT Zuugle.fr",
    url: "https://www2.zuugle.fr",
    key: "www2.zuugle.fr",
  },
  {
    name: "UAT Zuugle.it",
    url: "https://www2.zuugle.it",
    key: "www2.zuugle.it",
  },
  {
    name: "UAT Zuugle.si",
    url: "https://www2.zuugle.si",
    key: "www2.zuugle.si",
  },
];

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
  const { t } = useTranslation();

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
      <div
        className="countrySwitch"
        ref={triggerRef}
        onClick={() => setShowDomainMenu(true)}
      >
        <img
          src={`https://cdn.zuugle.at/img/zuugle_weiss.svg`}
          height={"19px"}
          width={"34px"}
          alt="Logo Zuugle"
        />
        <Typography
          style={{
            fontSize: "15.4px",
            color: "#FFF",
            lineHeight: "21px",
            marginLeft: "5px",
            whiteSpace: "nowrap",
          }}
        >
          {getDomainText()}
        </Typography>
        <KeyboardArrowDownIcon sx={{ width: "25px", color: "#ffff" }} />
      </div>
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
                    src={`https://cdn.zuugle.at/img/zuugle.svg`}
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
