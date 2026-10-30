import { useCallback, useEffect, useRef } from "react";
import { driver, type Driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./driverTour.css";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../hooks";
import { syncDialogOpened } from "../features/favoritesSlice";
import { TOURS, type PageTourDef } from "./tourDefinitions";

const STORAGE_PREFIX = "zuugle_tour_";
const STORAGE_SUFFIX = "_seen_v1";

// Global ref to prevent multiple tours from overlapping
let activeDriverInstance: Driver | null = null;

export const getTourStorageKey = (tourId: string) =>
  `${STORAGE_PREFIX}${tourId}${STORAGE_SUFFIX}`;

interface UsePageTourOptions {
  tourId: PageTourDef["tourId"];
  enabled?: boolean;
  delayMs?: number;
}

export function usePageTour({
  tourId,
  enabled = false,
  delayMs = 450,
}: UsePageTourOptions) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentTourRef = useRef<Driver | null>(null);

  const startTour = useCallback(
    ({ force = false }: { force?: boolean } = {}) => {
      const storageKey = getTourStorageKey(tourId);

      if (!force) {
        try {
          if (localStorage.getItem(storageKey) === "true") {
            return;
          }
        } catch {
          // Ignore localStorage errors
        }
      }

      // If another driver is currently active, close it first
      if (activeDriverInstance?.isActive()) {
        activeDriverInstance.destroy();
        activeDriverInstance = null;
      }

      const tourDef = TOURS[tourId];
      if (!tourDef) return;

      const actions = {
        openSyncDialog: () => {
          dispatch(syncDialogOpened(null));
        },
      };

      const driverSteps = tourDef.steps.map((step) => {
        let description = t(step.descKey);
        if (step.ctaButton) {
          const ctaText = t(step.ctaButton.textKey);
          description += `
            <div style="margin-top: 12px;">
              <button type="button" id="${step.ctaButton.id}" class="driver-zuugle-cta">
                ${ctaText}
              </button>
            </div>
          `;
        }

        return {
          element: step.element,
          skipMissingElement: step.skipMissingElement ?? false,
          popover: {
            title: t(step.titleKey),
            description,
            side: step.side,
            align: step.align,
            onPopoverRender: (
              popover: Parameters<
                NonNullable<import("driver.js").Popover["onPopoverRender"]>
              >[0],
            ) => {
              if (step.ctaButton) {
                const btn =
                  popover.description.querySelector<HTMLButtonElement>(
                    `#${step.ctaButton.id}`,
                  );
                if (btn) {
                  btn.onclick = () => {
                    step.ctaButton?.onClick(driverObj, actions);
                  };
                }
              }
              if (step.onPopoverRender) {
                step.onPopoverRender(popover, driverObj, actions);
              }
            },
          },
        };
      });

      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: "rgba(37, 73, 128, 0.45)",
        stagePadding: 6,
        stageRadius: 10,
        popoverClass: "zuugle-driver-popover",
        nextBtnText: t("tours.next"),
        prevBtnText: t("tours.prev"),
        doneBtnText: t("tours.done"),
        onDestroyed: () => {
          try {
            localStorage.setItem(storageKey, "true");
          } catch {
            // Ignore localStorage errors
          }
          if (activeDriverInstance === driverObj) {
            activeDriverInstance = null;
          }
        },
        steps: driverSteps,
      });

      activeDriverInstance = driverObj;
      currentTourRef.current = driverObj;
      driverObj.drive();
    },
    [tourId, t, dispatch],
  );

  useEffect(() => {
    if (!enabled) return;

    const storageKey = getTourStorageKey(tourId);
    let hasSeen = false;
    try {
      hasSeen = localStorage.getItem(storageKey) === "true";
    } catch {
      hasSeen = false;
    }

    if (hasSeen) return;

    const timer = setTimeout(() => {
      // Don't auto-start if another tour is already showing
      if (activeDriverInstance?.isActive()) return;

      const tourDef = TOURS[tourId];
      if (!tourDef || tourDef.steps.length === 0) return;

      const firstSelector = tourDef.steps[0].element;
      if (document.querySelector(firstSelector)) {
        startTour();
      }
    }, delayMs);

    return () => {
      clearTimeout(timer);
      if (currentTourRef.current?.isActive()) {
        currentTourRef.current.destroy();
        if (activeDriverInstance === currentTourRef.current) {
          activeDriverInstance = null;
        }
      }
    };
  }, [tourId, enabled, delayMs, startTour]);

  return { startTour };
}
