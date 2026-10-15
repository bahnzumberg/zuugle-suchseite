import { useTranslation } from "react-i18next";
import HikingIcon from "@mui/icons-material/Hiking";
import DownhillSkiingIcon from "@mui/icons-material/DownhillSkiing";
import SnowshoeingIcon from "@mui/icons-material/Snowshoeing";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import LandscapeIcon from "@mui/icons-material/Landscape";
import SleddingIcon from "@mui/icons-material/Sledding";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { tourTypes } from "./language_Utils";
import {
  CarabinerIcon,
  CrossCountrySkiingIcon,
  LadderIcon,
} from "../icons/tourTypeIcons";

type SvgIconComponent = typeof HikingIcon;

const TOUR_TYPE_ICONS: Record<string, SvgIconComponent> = {
  wandern: HikingIcon,
  weitwandern: HikingIcon,
  skitour: DownhillSkiingIcon,
  schneeschuh: SnowshoeingIcon,
  langlaufen: CrossCountrySkiingIcon,
  bike_hike: DirectionsBikeIcon,
  klettern: CarabinerIcon,
  klettersteig: LadderIcon,
  hochtour: LandscapeIcon,
  rodeln: SleddingIcon,
  trailrunning: DirectionsRunIcon,
};

/** Maps a raw tour.type (e.g. "Skitour", "Bike & Hike") to its key in `tourTypes`. */
export function normalizeTourType(type?: string | null): string | null {
  if (!type) return null;
  const key = type.toLowerCase().replace(/\s*&\s*/g, "_");
  return tourTypes.includes(key) ? key : null;
}

/** Translated label and matching icon for a tour type. Falls back to hiking. */
export function useTourType(type?: string | null): {
  label: string;
  Icon: SvgIconComponent;
} {
  const { t } = useTranslation();
  const key = normalizeTourType(type);
  return {
    label: key ? t(`filter.${key}`) : type || t("details.wanderung"),
    Icon: (key && TOUR_TYPE_ICONS[key]) || HikingIcon,
  };
}
