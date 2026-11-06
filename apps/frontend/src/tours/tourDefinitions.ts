import { Driver, PopoverDOM } from "driver.js";

export interface TourStepDef {
  element: string;
  titleKey: string;
  descKey: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  skipMissingElement?: boolean;
  onPopoverRender?: (
    popover: PopoverDOM,
    driverObj: Driver,
    actions?: { openSyncDialog?: () => void },
  ) => void;
  ctaButton?: {
    id: string;
    textKey: string;
    onClick: (
      driverObj: Driver,
      actions?: { openSyncDialog?: () => void },
    ) => void;
  };
}

export interface PageTourDef {
  tourId: "search" | "search_map" | "tour_detail" | "favorites";
  steps: TourStepDef[];
}

export const TOURS: Record<PageTourDef["tourId"], PageTourDef> = {
  search: {
    tourId: "search",
    steps: [
      {
        element: "#zuugle-search-box",
        titleKey: "tours.search.step_input_title",
        descKey: "tours.search.step_input_desc",
        side: "bottom",
        align: "center",
      },
      {
        element: "#search-filter-button",
        titleKey: "tours.search.step_filter_title",
        descKey: "tours.search.step_filter_desc",
        side: "bottom",
        align: "end",
      },
      {
        element: ".tour-card",
        titleKey: "tours.search.step_cards_title",
        descKey: "tours.search.step_cards_desc",
        side: "top",
        align: "center",
        skipMissingElement: true,
      },
      {
        element: "#favorites-toggle-button",
        titleKey: "tours.search.step_favorites_title",
        descKey: "tours.search.step_favorites_desc",
        side: "bottom",
        align: "end",
      },
    ],
  },

  search_map: {
    tourId: "search_map",
    steps: [
      {
        element: "#tour-map-container",
        titleKey: "tours.search_map.step_map_title",
        descKey: "tours.search_map.step_map_desc",
        side: "bottom",
        align: "center",
      },
      {
        element: "#map-weather-control-btn",
        titleKey: "tours.search_map.step_weather_title",
        descKey: "tours.search_map.step_weather_desc",
        side: "right",
        align: "start",
        skipMissingElement: true,
      },
    ],
  },

  tour_detail: {
    tourId: "tour_detail",
    steps: [
      {
        element: "#tour-itinerary-section",
        titleKey: "tours.tour_detail.step_itinerary_title",
        descKey: "tours.tour_detail.step_itinerary_desc",
        side: "bottom",
        align: "center",
      },
      {
        element: "#tour-interactive-map",
        titleKey: "tours.tour_detail.step_map_title",
        descKey: "tours.tour_detail.step_map_desc",
        side: "top",
        align: "center",
        skipMissingElement: true,
      },
      {
        element: "#tour-weather-section",
        titleKey: "tours.tour_detail.step_weather_title",
        descKey: "tours.tour_detail.step_weather_desc",
        side: "top",
        align: "center",
        skipMissingElement: true,
      },
    ],
  },

  favorites: {
    tourId: "favorites",
    steps: [
      {
        element: "#favorites-toggle-button",
        titleKey: "tours.favorites.step_favorites_title",
        descKey: "tours.favorites.step_favorites_desc",
        side: "bottom",
        align: "end",
      },
      {
        element: "#favorites-sync-button",
        titleKey: "tours.favorites.step_sync_title",
        descKey: "tours.favorites.step_sync_desc",
        side: "bottom",
        align: "end",
        ctaButton: {
          id: "driver-open-sync-btn",
          textKey: "tours.open_sync",
          onClick: (driverObj, actions) => {
            driverObj.destroy();
            actions?.openSyncDialog?.();
          },
        },
      },
    ],
  },
};
