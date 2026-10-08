import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// ─── Public types ────────────────────────────────────────────────────────────

/** A single section that the nav bar can scroll to. */
export interface QuickNavSection {
  /** Unique key used for equality checks and React keys. */
  id: string;
  /** CSS selector of the DOM element to observe and scroll to. */
  selector: string;
  /** Icon rendered inside the button. */
  icon: ReactNode;
  /** Accessible label for the button. */
  label: string;
  /**
   * If true the button is rendered even when its target element is not yet in
   * the DOM. Useful for sections that are created on demand (e.g. toggling
   * a map).
   */
  alwaysShow?: boolean;
  /**
   * Optional callback fired when the button is tapped. Runs *before* the
   * default smooth-scroll. Return a promise if the target element needs time
   * to mount (the component will await it before scrolling).
   */
  onClick?: () => void | Promise<void>;
  /**
   * If true the scroll-based detection will NOT auto-highlight this button.
   * Useful for sections whose DOM element is sticky or always in the viewport.
   */
  noAutoHighlight?: boolean;
  /**
   * CSS selector of an input element whose focus state controls this button's
   * highlight. When the input is focused, this button shows as active.
   */
  focusSelector?: string;
  /**
   * If true, clicking the button only fires `onClick` without the default
   * smooth-scroll to `selector`. Use when `onClick` handles navigation itself
   * (e.g. focusing an input that's already in view).
   */
  skipScroll?: boolean;
}

export interface MobileQuickNavProps {
  /** Ordered list of sections. Buttons appear in this order. */
  sections: QuickNavSection[];
  /**
   * CSS selector of the sticky/fixed header element whose height should be
   * subtracted when scrolling to a section. If provided, its `offsetHeight`
   * is measured at scroll time so the offset stays correct even if the header
   * resizes. Falls back to `headerOffset` when the element isn't found.
   */
  headerSelector?: string;
  /**
   * Fixed pixel offset subtracted from scroll target. Used as fallback when
   * `headerSelector` is not provided or the element isn't found. Defaults to
   * 72.
   */
  headerOffset?: number;
  /**
   * Minimum number of *visible* sections required before the bar renders.
   * Defaults to 2.
   */
  minVisible?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Fixed bottom bar shown only on mobile (< 600 px).
 *
 * Renders equally-sized buttons that smooth-scroll to the corresponding page
 * section.  A scroll listener highlights whichever eligible section is
 * currently in view — specifically, the last section (in DOM order) whose top
 * edge has scrolled past the sticky header.  This approach works reliably for
 * sections with very different heights (unlike IntersectionObserver ratio).
 *
 * Sections that don't exist in the DOM are automatically hidden.
 */
export default function MobileQuickNav({
  sections,
  headerSelector,
  headerOffset = 72,
  minVisible = 2,
}: MobileQuickNavProps) {
  const [active, setActive] = useState<string | null>(null);

  // Track which sections actually exist in the DOM (they render conditionally)
  const [visible, setVisible] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((s) => [s.id, false])),
  );

  const prevFoundRef = useRef("");

  // ── Measure the header height ──────────────────────────────────────────────

  const getHeaderHeight = useCallback(() => {
    if (!headerSelector) return headerOffset;
    return (
      document.querySelector<HTMLElement>(headerSelector)?.offsetHeight ??
      headerOffset
    );
  }, [headerSelector, headerOffset]);

  // ── DOM scanning: track which sections exist ───────────────────────────────

  useEffect(() => {
    const rescan = () => {
      const found: Record<string, boolean> = {};
      for (const s of sections) {
        found[s.id] = !!document.querySelector(s.selector);
      }
      const key = JSON.stringify(found);
      if (key === prevFoundRef.current) return;
      prevFoundRef.current = key;
      setVisible(found);
    };

    rescan();

    let timer: ReturnType<typeof setTimeout>;
    const mutObs = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(rescan, 300);
    });
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      mutObs.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  // ── Scroll-based active section detection ──────────────────────────────────
  //
  // Pick the *last* section (in DOM/config order) whose top edge has scrolled
  // past the header bottom.  This works correctly for sections of any height.

  useEffect(() => {
    const detect = () => {
      const hh = getHeaderHeight();
      let best: string | null = null;

      for (const s of sections) {
        if (s.noAutoHighlight) continue;
        const el = document.querySelector(s.selector);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Section counts as "in view" when its top is at or above the header
        // bottom AND its bottom is still below the header (i.e. still visible).
        if (rect.top <= hh + 10 && rect.bottom > hh) {
          best = s.id;
        }
      }

      setActive((prev) => {
        // Don't override a focus-driven highlight (handled by focusin/out)
        const focusSection = sections.find(
          (s) => s.focusSelector && prev === s.id,
        );
        if (focusSection) {
          const focusEl = document.querySelector<HTMLElement>(
            focusSection.focusSelector!,
          );
          if (focusEl && document.activeElement === focusEl) return prev;
        }
        return best;
      });
    };

    window.addEventListener("scroll", detect, { passive: true });
    detect(); // initial
    return () => window.removeEventListener("scroll", detect);
  }, [sections, getHeaderHeight]);

  // ── Focus-based highlighting (e.g. Suche button when search input focused) ─

  useEffect(() => {
    const focusSections = sections.filter((s) => s.focusSelector);
    if (focusSections.length === 0) return;

    const onFocusIn = (e: FocusEvent) => {
      for (const s of focusSections) {
        const target = document.querySelector(s.focusSelector!);
        if (target && target === e.target) {
          setActive(s.id);
          return;
        }
      }
    };

    const onFocusOut = (e: FocusEvent) => {
      for (const s of focusSections) {
        const target = document.querySelector(s.focusSelector!);
        if (target && target === e.target) {
          // Let the scroll handler pick the right section on next tick
          setActive(null);
          return;
        }
      }
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [sections]);

  // ── Scroll-to helper ───────────────────────────────────────────────────────

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const offset = getHeaderHeight();
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Don't render if fewer than minVisible sections exist
  const count = sections.filter((s) => s.alwaysShow || visible[s.id]).length;
  if (count < minVisible) return null;

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
      {sections
        .filter((b) => b.alwaysShow || visible[b.id])
        .map((b, i, arr) => {
          const isActive = active === b.id;
          const isLast = i === arr.length - 1;
          return (
            <ButtonBase
              key={b.id}
              aria-label={b.label}
              onClick={async () => {
                await b.onClick?.();
                if (!b.skipScroll) scrollTo(b.selector);
              }}
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
                  : "2px solid rgba(255,255,255,0.4)",
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
