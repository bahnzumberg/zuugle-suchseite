import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import DirectionsTransitRoundedIcon from "@mui/icons-material/DirectionsTransitRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import { useEffect, useRef, useState } from "react";

/** CSS selector for each scrollable section on the tour detail page. */
const SECTIONS = [
  { id: "fahrplan", selector: ".tour-fahrplan-panel" },
  { id: "wetter", selector: ".tour-weather-panel" },
  { id: "karte", selector: ".tour-detail-map-container" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/** Height of the sticky header bar so scrollIntoView lands just below it. */
const HEADER_OFFSET = 72;

/**
 * Fixed bottom bar shown only on mobile (< 600 px) on the tour detail page.
 * Three equally sized buttons scroll to the timetable, weather, and map
 * sections. An IntersectionObserver highlights whichever section is currently
 * most visible.
 */
export default function MobileQuickNav() {
  const [active, setActive] = useState<SectionId | null>(null);

  // Track which sections actually exist in the DOM (they render conditionally)
  const [visible, setVisible] = useState<Record<SectionId, boolean>>({
    fahrplan: false,
    wetter: false,
    karte: false,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const prevFoundRef = useRef("");

  useEffect(() => {
    const entries = new Map<Element, SectionId>();
    const ratios = new Map<SectionId, number>();

    /** Scan the DOM for target sections and (re-)wire the IntersectionObserver */
    const rescan = () => {
      const found: Record<SectionId, boolean> = {
        fahrplan: false,
        wetter: false,
        karte: false,
      };
      for (const s of SECTIONS) {
        found[s.id] = !!document.querySelector(s.selector);
      }

      // Only update state + observers when sections actually changed
      const key = JSON.stringify(found);
      if (key === prevFoundRef.current) return;
      prevFoundRef.current = key;

      setVisible(found);

      // Teardown previous observer
      observerRef.current?.disconnect();
      entries.clear();
      ratios.clear();

      observerRef.current = new IntersectionObserver(
        (observed) => {
          for (const entry of observed) {
            const sid = entries.get(entry.target);
            if (sid) ratios.set(sid, entry.intersectionRatio);
          }

          // Pick the section with the highest visibility ratio,
          // but require at least 15 % visible before highlighting any button.
          let best: SectionId | null = null;
          let bestRatio = 0.15;
          for (const [sid, ratio] of ratios) {
            if (ratio > bestRatio) {
              best = sid;
              bestRatio = ratio;
            }
          }
          setActive(best);
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
      );

      for (const s of SECTIONS) {
        const el = document.querySelector(s.selector);
        if (el) {
          entries.set(el, s.id);
          observerRef.current.observe(el);
        }
      }
    };

    // Initial scan
    rescan();

    // Debounced re-scan whenever DOM structure changes (sections load async)
    let timer: ReturnType<typeof setTimeout>;
    const mutObs = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(rescan, 300);
    });
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
      mutObs.disconnect();
    };
  }, []);

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Don't render if fewer than 2 sections exist
  const count = Object.values(visible).filter(Boolean).length;
  if (count < 2) return null;

  const buttons: {
    id: SectionId;
    icon: React.ReactNode;
    label: string;
    selector: string;
  }[] = [
    {
      id: "fahrplan",
      icon: <DirectionsTransitRoundedIcon sx={{ fontSize: 26 }} />,
      label: "Fahrplan",
      selector: ".tour-fahrplan-panel",
    },
    {
      id: "wetter",
      icon: <WbSunnyRoundedIcon sx={{ fontSize: 26 }} />,
      label: "Wetter",
      selector: ".tour-weather-panel",
    },
    {
      id: "karte",
      icon: <MapRoundedIcon sx={{ fontSize: 26 }} />,
      label: "Karte",
      selector: ".tour-detail-map-container",
    },
  ];

  return (
    <Box
      sx={{
        display: { xs: "flex", sm: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        bgcolor: "var(--bzb-bahnblau)",
        height: "56px",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {buttons
        .filter((b) => visible[b.id])
        .map((b, i, arr) => {
          const isActive = active === b.id;
          const isLast = i === arr.length - 1;
          return (
            <ButtonBase
              key={b.id}
              aria-label={b.label}
              onClick={() => scrollTo(b.selector)}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                transition: "opacity 0.2s ease",
                borderRight: isLast
                  ? "none"
                  : "2px solid rgba(255,255,255,0.2)",
                position: "relative",
                "&::after": isActive
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: 6,
                      left: "30%",
                      right: "30%",
                      height: 3,
                      borderRadius: 2,
                      bgcolor: "var(--bzb-lindgruen)",
                    }
                  : undefined,
              }}
            >
              {b.icon}
            </ButtonBase>
          );
        })}
    </Box>
  );
}
