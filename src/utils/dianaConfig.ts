/**
 * Diana API configuration.
 *
 * All time values are stored in MEZ (Europe/Vienna local time).
 * They MUST be converted to UTC before sending to the Diana API.
 * Use `localTimeToUtc()` from dianaApi.ts for conversion.
 */

/** Base URL for the Diana API */
export const DIANA_API_BASE_URL = "https://api.zuugle-services.net";

/**
 * Activity time windows (MEZ / Europe/Vienna local time).
 *
 * These define the arrival and departure windows for the /connections endpoint.
 * - earliest_start_time: Earliest the user is willing to arrive at the activity
 * - latest_start_time:   Latest the user must arrive (hard deadline)
 * - earliest_end_time:   Earliest the user is willing to depart from the activity
 * - latest_end_time:     Latest the user is willing to depart
 */
export const DIANA_ACTIVITY_TIMES = {
  earliest_start_time: "05:30",
  latest_start_time: "15:00",
  earliest_end_time: "12:00",
  latest_end_time: "22:00",
};
