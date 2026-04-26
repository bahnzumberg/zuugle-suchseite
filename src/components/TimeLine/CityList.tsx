import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { Cities2TourCity } from "../../features/apiSlice";
import { CityObject } from "../../features/searchSlice";

interface CityChipProps {
  slug: string;
  name: string;
  tourId: string;
  reachable: boolean;
}

function CityChip({ slug, name, tourId, reachable }: CityChipProps) {
  return (
    <Chip
      label={name}
      component="a"
      href={reachable ? `/tour/${tourId}/${slug}` : `/search?city=${slug}`}
      clickable
      sx={{
        bgcolor: "#F5F5F5",
        fontSize: "13px",
        fontWeight: 500,
        "&:hover": {
          bgcolor: "#E0E0E0",
        },
      }}
    />
  );
}

export interface CityListProps {
  tourId: string;
  cities2tour: Cities2TourCity[] | undefined;
  allCities: CityObject[];
}

export default function CityList({
  tourId,
  cities2tour,
  allCities,
}: CityListProps) {
  const { t } = useTranslation();
  const [showMoreCities, setShowMoreCities] = useState(false);

  const hasTourCities = cities2tour && cities2tour.length > 0;
  const reachableCities = hasTourCities
    ? cities2tour.filter((c) => c.reachable === 1)
    : [];
  const unreachableCities = hasTourCities
    ? cities2tour.filter((c) => c.reachable === 0)
    : [];

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        padding: "20px",
        marginTop: "20px",
      }}
    >
      {hasTourCities && (
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#101010",
            mb: "8px",
          }}
        >
          {t("details.staedte_mit_verbindung")}
        </Typography>
      )}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {hasTourCities
          ? reachableCities.map((c) => (
              <CityChip
                key={c.city_slug}
                slug={c.city_slug}
                name={c.city_name}
                tourId={tourId}
                reachable
              />
            ))
          : allCities.map((c) => (
              <CityChip
                key={c.value}
                slug={c.value}
                name={c.label}
                tourId={tourId}
                reachable={false}
              />
            ))}
      </Box>
      {hasTourCities && unreachableCities.length > 0 && (
        <>
          {!showMoreCities ? (
            <Link
              component="button"
              onClick={() => setShowMoreCities(true)}
              sx={{
                mt: "16px",
                display: "block",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                color: "#8B8B8B",
              }}
            >
              {t("details.weitere_staedte_anzeigen")}
            </Link>
          ) : (
            <Box
              sx={{
                mt: "16px",
                pt: "12px",
                borderTop: "1px solid #EBEBEB",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#8B8B8B",
                  mb: "8px",
                }}
              >
                {t("details.staedte_ohne_verbindung")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {unreachableCities.map((c) => (
                  <CityChip
                    key={c.city_slug}
                    slug={c.city_slug}
                    name={c.city_name}
                    tourId={tourId}
                    reachable={false}
                  />
                ))}
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
