import { useEffect, useMemo, useState } from "react";
import { useGetWeatherMetadataQuery } from "../features/apiSlice";
import { filterPastDays } from "../models/weatherOverlay";

/** The map overlay's upcoming days and the selected one, preselecting the first. */
export function useWeatherOverlay() {
  const { data } = useGetWeatherMetadataQuery();
  const weatherMetadata = useMemo(
    () => (data ? filterPastDays(data) : null),
    [data],
  );
  const [selectedWeatherDate, setSelectedWeatherDate] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const firstDay = weatherMetadata?.days[0]?.date;
    if (firstDay) setSelectedWeatherDate((current) => current ?? firstDay);
  }, [weatherMetadata]);

  return { weatherMetadata, selectedWeatherDate, setSelectedWeatherDate };
}
