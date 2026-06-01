# Comprehensive API Documentation for the `Diana` API

This document provides all the details necessary for a developer to integrate the `Diana` API into applications. It includes endpoints for travel connections, address autocomplete, and journey sharing functionality.

PDF available under: [Diana_API_Docs.pdf](https://diana.zuugle-services.net/docs/Diana_API_Docs.pdf)
Markdown version available under: [Diana_API_Docs.md](https://diana.zuugle-services.net/docs/Diana_API_Docs.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Quota System](#quota-system)
3. [Endpoint Details](#endpoint-details)
   - [Connections](#connections)
   - [Journey](#journey)
   - [Address Autocomplete](#address-autocomplete)
   - [Reverse Geocoding](#reverse-geocoding)
   - [Quota Check](#quota-check)
   - [Generate Ticketshop Link](#generate-ticketshop-link)
   - [Share Journey](#share-journey)
   - [Retrieve Shared Journey](#retrieve-shared-journey)
4. [Request Parameters](#request-parameters)
5. [Guide: Using Activity Time Parameters](#guide-using-activity-time-parameters)
6. [Loading Earlier / Later Connections (Scrolling)](#loading-earlier--later-connections-scrolling)
7. [Understanding the Response](#understanding-the-response)
    - [Connections Response](#connections-response)
    - [Journey Response](#journey-response)
    - [Address Autocomplete Response](#address-autocomplete-response)
    - [Reverse Geocoding Response](#reverse-geocoding-response)
    - [Quota Check Response](#quota-check-response)
    - [Generate Ticketshop Link Response](#generate-ticketshop-link-response)
    - [Share Journey Response](#share-journey-response)
    - [Retrieve Shared Journey Response](#retrieve-shared-journey-response)
8. [Errors and Codes](#errors-and-codes)
9. [Example Usage](#example-usage)
10. [Troubleshooting & Edge Cases](#troubleshooting--edge-cases)


---

## Overview

The `Diana` API provides:
1. Detailed, real-time travel information to and from specified activities (`/connections`).
2. Simple A-to-B route planning (`/journey`).
3. Address autocomplete functionality for location searches (`/address-autocomplete`).
4. Reverse geocoding capabilities (`/reverse-geocode`).
5. Customer quota and plan status (`/quota`).
6. On-demand ticketshop link generation for specific journeys (`/generate-ticketshop-link`).
7. The ability to create and retrieve shareable journey links (`/share/...`).

All timestamps sent to or received from the API are in UTC. Activity time parameters (`activity_earliest_start_time`, etc.) must be sent as UTC â€” the widget converts the activity's local times to UTC using the `timezone` parameter before sending. API usage may be subject to a monthly and/or yearly quota depending on the customer's plan.

---

## Quota System

Starter-Plan customers are subject to configurable request quotas on the `/connections` and `/journey` endpoints.

### Quota Types

| Type              | Field             | Description                                                          |
|-------------------|-------------------|----------------------------------------------------------------------|
| **Monthly quota** | `monthly_quota`   | Maximum requests allowed per calendar month. Always enforced.        |
| **Yearly quota**  | `yearly_quota`    | Maximum requests allowed per calendar year. `null` = no yearly cap. |
| **Soft quota**    | `soft_quota_overstep` | Extra requests permitted *beyond* each hard limit before rejection. `0` = disabled. |

### Evaluation Order and Revenue Safety

When a request arrives the system evaluates the limits in this fixed order:

1. **Monthly check** â€“ if `requests_this_month >= monthly_quota + soft_quota_overstep` â†’ reject with code `6001`.
2. **Yearly check** (only when `yearly_quota` is set) â€“ if `requests_this_year >= yearly_quota + soft_quota_overstep` â†’ reject with code `6002`.

The **monthly limit is always checked first**.  Even if the yearly quota has not been reached, a monthly-ceiling breach immediately stops the request.  This guarantees that peak-month revenue risk is bounded regardless of the yearly setting.

The soft-quota overstep (`soft_quota_overstep`) is applied independently to both the monthly and the yearly hard limit.  For example, with `monthly_quota = 100`, `yearly_quota = 1000`, and `soft_quota_overstep = 50`:

| Limit      | Hard quota | Soft ceiling | Rejection code |
|------------|-----------|--------------|----------------|
| Monthly    | 100       | 150          | `6001`         |
| Yearly     | 1000      | 1050         | `6002`         |

### Warning Emails

When `quota_warning_enabled` is set to `true` for a customer an email is automatically dispatched to the team (and, if configured, to the customer) **once per period** (month/year) the first time their usage reaches the respective hard quota.  The email is sent regardless of whether a soft quota is configured.

---

## Endpoint Details

### Connections
#### **HTTP Method**: `GET`
#### **URL**: `/connections`
#### **Authentication**:
- **OAuth 2.0** with `read_diana` scope
- **Bearer Token** must be included in the `Authorization` header: `Bearer [token]`

Calculates optimal travel journeys to and from a dynamically defined activity. The activity's details (locations, times, duration) are passed directly as request parameters. Implements fallback logic to find the latest possible return journey if the initially calculated timeline yields no results. All time parameters must be sent in UTC.

**Note on time parameters:** Highly flexible â€” see the [Guide: Using Activity Time Parameters](#guide-using-activity-time-parameters) section.

**Note on scrolling:** The initial response returns a scored batch centred around the activity window. Use the optional `to_connections_before` / `to_connections_after` / `from_connections_before` / `from_connections_after` parameters to fetch earlier or later batches without reloading everything. See [Loading Earlier / Later Connections (Scrolling)](#loading-earlier--later-connections-scrolling).

#### **Quota**
Starter-Plan users are limited to a monthly (and optionally yearly) request quota on this endpoint.
- A standard request counts as **1** towards both the monthly and yearly quota counters.
- A **scroll request** (any request that includes `to_connections_before`, `to_connections_after`, `from_connections_before`, or `from_connections_after`) counts as **0.5**.
- Exceeding either quota will result in an error response (see [Quota System](#quota-system) and [Errors and Codes](#errors-and-codes)).

Pro-Plan users are not affected by a request quota.

Realtime requests are automatically made, when possible, and if the user has a Realtime Addon.

For more information see [Diana GreenConnect Info Page](https://zuugle-services.com/en/diana-widget/)

### Journey
#### **HTTP Method**: `GET`
#### **URL**: `/journey`
#### **Authentication**:
- **OAuth 2.0** with `read_diana` scope
- **Bearer Token** must be included in the `Authorization` header: `Bearer [token]`

Calculates simple A-to-B public transport connections. This endpoint is designed for straightforward routing from a starting point to a destination at a specific time.

#### **Quota**
This endpoint shares the same monthly (and optional yearly) quota as the `/connections` endpoint for Starter-Plan users. Each request counts as **1** towards both quota counters.

### Address Autocomplete
#### **HTTP Method**: `GET`
#### **URL**: `/address-autocomplete`
#### **Authentication**:
- **OAuth 2.0** with `read_diana` scope
- **Bearer Token** must be included in the `Authorization` header: `Bearer [token]`

### Reverse geocoding
#### **HTTP Method**: `GET`
#### **URL**: `/reverse-geocode`
#### **Authentication**:
- **OAuth 2.0** with `read_diana` scope
- **Bearer Token** must be included in the `Authorization` header: `Bearer [token]`

### Quota Check
#### **HTTP Method**: `GET`
#### **URL**: `/quota`
#### **Authentication**:
- **OAuth 2.0** with `read_diana` scope
- **Bearer Token** must be included in the `Authorization` header: `Bearer [token]`

Provides an endpoint for customers to check their current quota usage and active plan details.

### Generate Ticketshop Link
#### **HTTP Method**: `POST`
#### **URL**: `/generate-ticketshop-link`
#### **Authentication**:
- **OAuth 2.0** with `read_diana` scope
- **Bearer Token** must be included in the `Authorization` header: `Bearer [token]`

Generates ticketshop deeplinks for a single, specific connection on-demand. The client sends the `connection_elements` array of the desired journey, and the API returns the corresponding ticketshop URL(s) if available.

#### Supported Ticketshop Providers
The API automatically selects the appropriate ticketshop provider based on the connection's origin country:

| Provider        | Countries Covered                                                                                                | Supports All Transport Types? |
|-----------------|------------------------------------------------------------------------------------------------------------------|-------------------------------|
| **OEBB**        | Austria                                                                                                          | âœ… Yes (trains, buses, etc.)   |
| **SBB**         | Switzerland                                                                                                      | âœ… Yes (trains, buses, etc.)   |
| **TRAIVELLING** | All other European countries (Germany, France, Italy, Spain, Netherlands, Belgium, Czech Republic, Poland, etc.) | âŒ No (trains only, no buses)  |

**Important:** Because **Traivelling does not support bus routes**, connections with bus legs may be split into multiple ticket segments. **However, transfers (walk/transfer legs) do NOT break segment continuity** - multiple train legs separated only by transfers are booked as a single ticket. For example:
- Train â†’ Transfer â†’ Train â†’ **Single Traivelling ticket** (one combined booking)
- Train â†’ Bus â†’ Train â†’ **Multiple segments** (separate tickets for the two train segments)
- Bus segment â†’ **No ticket available** (`provider: null`)

The response includes a `connection_ticketshop_segments` array that clearly indicates which legs are covered by which provider. See [Ticketshop Segment](#ticketshop-segment) for details.

### Share Journey
#### **HTTP Method**: `POST`
#### **URL**: `/share/`
#### **Authentication**:
- **OAuth 2.0** with `read_diana` scope
- **Bearer Token** must be included in the `Authorization` header: `Bearer [token]`

Creates a unique, shareable link for a specified journey by saving its data. Returns a unique hash ID.

### Retrieve Shared Journey
#### **HTTP Method**: `GET`
#### **URL**: `/share/<uuid:hash_key>/`
#### **Authentication**:
- **OAuth 2.0** with `read_diana` scope
- **Bearer Token** must be included in the `Authorization` header: `Bearer [token]`

Retrieves the data for a previously shared journey using its unique hash key.

---

## Request Parameters

### Connections Parameters
The activity is defined directly via query parameters.

| Parameter                      | Type      | Required | Default            | Description                                                                                                      |
|--------------------------------|-----------|----------|--------------------|------------------------------------------------------------------------------------------------------------------|
| `id`                           | `integer` | No       | -1                 | Activity ID. Defaults to -1, indicating a dynamically defined activity via the parameters below.                 |
| `user_start_location`          | `string`  | Yes      | -                  | The user's starting location. Can be an address, station name, or coordinates (format: `lat,lon`).               |
| `date`                         | `string`  | No       | Current date (UTC) | The travel date in `YYYY-MM-DD` format (interpreted as UTC).                                                     |
| `user_start_location_type`     | `string`  | No       | `address`          | Specifies the type of `user_start_location`. Values: `address`, `station`, `coordinates`, `coord`, `coords`.     |
| `user_start_location_display_name` | `string` | No   | `null`             | Human-readable display name for the user's starting location, as selected from autocomplete (e.g. `"Wien Hauptbahnhof, Wien"`). Used to detect and remove the spurious walk that the routing engine inserts from the user's coordinate to the nearest platform node. When provided, the walk is removed if it is â‰¤10 min, <200 m, and the platform name roughly matches this value. Without it, removal falls back to a conservative â‰¤5 min distance-only check. **Strongly recommended when `user_start_location_type` is `coordinates`.** |
| `activity_name`                | `string`  | Yes      | -                  | A name for the activity.                                                                                         |
| `activity_start_location`      | `string`  | Yes      | -                  | The starting location of the activity. Can be an address, station name, or coordinates.                          |
| `activity_start_location_type` | `string`  | No       | `address`          | Specifies the type of `activity_start_location`. Values: `address`, `station`, `coordinates`, `coord`, `coords`. |
| `activity_end_location`        | `string`  | Yes      | -                  | The ending location of the activity. Can be an address, station name, or coordinates.                            |
| `activity_end_location_type`   | `string`  | No       | `address`          | Specifies the type of `activity_end_location`. Values: `address`, `station`, `coordinates`, `coord`, `coords`.   |
| `activity_earliest_start_time` | `time`    | Yes      | -                  | The earliest start time of the activity in `HH:MM:SS` format (UTC).                                              |
| `activity_latest_start_time`   | `time`    | Yes      | -                  | The latest start time of the activity in `HH:MM` or `HH:MM:SS` format (UTC).                                     |
| `activity_earliest_end_time`   | `time`    | Yes      | -                  | The earliest end time of the activity in `HH:MM` or `HH:MM:SS` format (UTC).                                     |
| `activity_latest_end_time`     | `time`    | Yes      | -                  | The latest end time of the activity in `HH:MM:SS` format (UTC).                                                  |
| `activity_duration_minutes`    | `integer` | Yes      | -                  | The duration of the activity in minutes.                                                                         |
| `activity_duration_days`       | `integer` | No       | 1                  | The duration of the activity in days. Minimum value is 1.                                                        |
| `activity_start_location_display_name` | `string` | No | `null` | Custom display name for the activity start location. If omitted, the backend resolves a name via geocoding. |
| `activity_end_location_display_name`   | `string` | No | `null` | Custom display name for the activity end location. If omitted, the backend resolves a name via geocoding.   |
| `activity_start_time_label`            | `string` | No | `null` | Custom label for the activity start time displayed in results (e.g. `"Check-in"`).                          |
| `activity_end_time_label`              | `string` | No | `null` | Custom label for the activity end time displayed in results (e.g. `"Check-out"`).                           |
| `timezone`                             | `string` | No | `Europe/Vienna` | IANA timezone identifier for the activity (e.g. `"Europe/Vienna"`, `"America/New_York"`). Used to interpret activity times on the client side and is echoed back in the response. Invalid values silently fall back to `"Europe/Vienna"`. |
| `to_connections_before`               | `datetime` | No | `null` | **Scroll:** return to-connections with `connection_start_timestamp` **before** this UTC datetime. Used to load earlier departures. Mutually exclusive with `to_connections_after`. ISO 8601 UTC (e.g. `2026-05-10T06:30:00Z`). |
| `to_connections_after`                | `datetime` | No | `null` | **Scroll:** return to-connections with `connection_start_timestamp` **after** this UTC datetime. Used to load later departures. Mutually exclusive with `to_connections_before`. |
| `from_connections_before`             | `datetime` | No | `null` | **Scroll:** return from-connections with `connection_start_timestamp` **before** this UTC datetime. Mutually exclusive with `from_connections_after`. |
| `from_connections_after`              | `datetime` | No | `null` | **Scroll:** return from-connections with `connection_start_timestamp` **after** this UTC datetime. Mutually exclusive with `from_connections_before`. |
| `use_flex`                            | `boolean`  | No | `true` | Whether to allow **FLEX** (on-demand / flexible) transit services for first- and last-mile legs when routing via MOTIS. When `true` (default), MOTIS may route via FLEX services (e.g. Rufbus, on-demand shuttles) to reach or leave the nearest fixed-schedule stop. When `false`, only walking is used for first- and last-mile legs and FLEX services are excluded entirely. Other providers (VAO, HAFAS) are not affected by this parameter. |

**Note on timezones:** `activity_*_start_time` and `activity_*_end_time` must be sent as **UTC**. Clients using the widget convert the activity's local times to UTC using the `timezone` parameter before sending.

**Note on scroll parameters:** These are for pagination only â€” all standard activity parameters must still be included in every scroll request. See [Loading Earlier / Later Connections (Scrolling)](#loading-earlier--later-connections-scrolling).

### Journey Parameters
| Parameter            | Type      | Required | Default      | Description                                                                                                                |
|----------------------|-----------|----------|--------------|----------------------------------------------------------------------------------------------------------------------------|
| `from_location`      | `string`  | Yes      | -            | The starting location. Can be an address, station name, or coordinates (format: `lat,lon`).                                |
| `from_location_type` | `string`  | No       | `address`    | Specifies the type of `from_location`. Values: `address`, `station`, `coordinates`, `coord`, `coords`.                     |
| `to_location`        | `string`  | Yes      | -            | The destination location. Can be an address, station name, or coordinates.                                                 |
| `to_location_type`   | `string`  | No       | `address`    | Specifies the type of `to_location`. Values: `address`, `station`, `coordinates`, `coord`, `coords`.                       |
| `date`               | `string`  | No       | Current date | The travel date in `YYYY-MM-DD` format (interpreted as UTC). Defaults to today.                                            |
| `time`               | `time`    | No       | Current time | The travel time in `HH:MM` or `HH:MM:SS` format (UTC). Defaults to now.                                                    |
| `is_arrival`         | `boolean` | No       | `false`      | If `true`, the `time` parameter specifies the desired arrival time. If `false` (default), it specifies the departure time. |
| `use_flex`           | `boolean` | No       | `true`       | Whether to allow **FLEX** (on-demand / flexible) transit services for first- and last-mile legs when routing via MOTIS. When `true` (default), MOTIS may route via FLEX services (e.g. Rufbus, on-demand shuttles) to reach or leave the nearest fixed-schedule stop. When `false`, only walking is used for first- and last-mile legs and FLEX services are excluded entirely. Other providers (VAO, HAFAS) are not affected by this parameter. |

### Address Autocomplete Parameters
| Parameter       | Type      | Required | Description                                                                |
|-----------------|-----------|----------|----------------------------------------------------------------------------|
| `q`             | `string`  | Yes      | Search query for address autocomplete (e.g., "Wien Step")                  |
| `limit`         | `integer` | No       | Maximum number of results to return (default: 5)                           |
| `hint_lat`      | `float`   | No       | Latitude hint for location bias                                            |
| `hint_lon`      | `float`   | No       | Longitude hint for location bias                                           |
| `lang`          | `string`  | No       | Language preference for results (`en`, `de`, `fr`). Defaults to `default`. |
| `global_search` | `boolean` | No       | If true, performs a global search without location bias.                   |

### Reverse Geocoding Parameters
| Parameter | Type    | Required | Description                                  |
|-----------|---------|----------|----------------------------------------------|
| `lat`     | `float` | Yes      | Latitude of the location to reverse geocode  |
| `lon`     | `float` | Yes      | Longitude of the location to reverse geocode |

### Generate Ticketshop Link Parameters (Request Body)
| Parameter             | Type      | Required | Description                                                                                                                                                                                                                                                                                     |
|-----------------------|-----------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `connection_elements` | `array`   | Yes      | An array of `Connection Element` objects, exactly as received from the `/connections` or `/journey` endpoint for a journey.                                                                                                                                                                     |
| `segment_index`       | `integer` | No       | **(Optional)** Index into `connection_ticketshop_segments` (0-based). If provided, generates a link **only** for the specified segment. If omitted, generates links for **all** segments with a provider (see response format below). Use this when you need a specific ticket for a leg range. |

### Share Journey Parameters (Request Body)
| Parameter                    | Type       | Required | Description                                                            |
|------------------------------|------------|----------|------------------------------------------------------------------------|
| `origin`                     | `string`   | Yes      | The starting location name for the shared journey (the raw text the user typed). |
| `origin_display_name`        | `string`   | No       | The human-readable display name for the user's start location, as selected from autocomplete (e.g. `"Wien Hauptbahnhof, Wien"`). Stored alongside the share data and returned on retrieval. |
| `origin_lat`                 | `float`    | No       | The latitude of the origin.                                            |
| `origin_lon`                 | `float`    | No       | The longitude of the origin.                                           |
| `date`                       | `date`     | Yes      | The start date of the journey (`YYYY-MM-DD`).                          |
| `dateEnd`                    | `date`     | No       | The end date of the journey (`YYYY-MM-DD`), if it spans multiple days. |
| `to_connection_start_time`   | `datetime` | No       | The full start timestamp of the journey to the activity (ISO 8601).    |
| `to_connection_end_time`     | `datetime` | No       | The full end timestamp of the journey to the activity (ISO 8601).      |
| `from_connection_start_time` | `datetime` | No       | The full start timestamp of the journey from the activity (ISO 8601).  |
| `from_connection_end_time`   | `datetime` | No       | The full end timestamp of the journey from the activity (ISO 8601).    |
| `shareURLPrefix`             | `url`      | No       | The base URL of the client application where the share was initiated.  |
| `activity`                   | `object`   | No       | The full `activity` object from the `/connections` response. Stored and returned with the shared journey so recipients see the same activity context as the original viewer. |

### Retrieve Shared Journey Parameters (URL)
| Parameter  | Type     | Required | Description                                     |
|------------|----------|----------|-------------------------------------------------|
| `hash_key` | `uuid`   | Yes      | The unique UUID identifying the shared journey. |

---

## Guide: Using Activity Time Parameters

To help you find the perfect journey, our API asks for four key time parameters for your activity.

Think of these not as *exact* times, but as the **flexible windows** you are available. This guide will show you how to set them and how our API uses them to find the best recommended journey for you.

The four parameters are:

* `activity_earliest_start_time`: The *earliest* you are willing to **arrive** at your activity.
* `activity_latest_start_time`: The *latest* you must **arrive** (e.g., when the activity officially begins).
* `activity_earliest_end_time`: The *earliest* you are willing to **depart** from your activity.
* `activity_latest_end_time`: The *latest* you are willing to **depart**.

### 1. The "To Activity" Journey (Your Arrival Window)

This journey is defined by `earliest_start_time` and `latest_start_time`.

* **`activity_latest_start_time`:** This is your hard deadline. If your event starts at 10:00, set this to `10:00`. The API will *not* recommend any journey that arrives after this time.
* **`activity_earliest_start_time`:** This is your "buffer." If your event is at 10:00, you might be willing to arrive as early as 09:00 to grab a coffee. Setting this to `09:00` gives the API more options.

#### How We Find Your "Best" Arrival

Our API searches for all connections that arrive *within* your window. The "best" (recommended) connection is **not** the one that arrives at the last possible second.

Instead, we find a "sweet spot" that gives you a comfortable buffer without making you wait too long. We generally aim for a time about **one-third of the way into your arrival window**, but later options are also considered.

**Example:**

* `earliest_start_time`: `09:00`
* `latest_start_time`: `10:00`
* Your Window: A 60-minute arrival window.
* **Our "Sweet Spot" Target:** `09:20` (20 minutes after your earliest time)

The API will recommend the journey that arrives closest to **09:20**.

**Visualization: Your Arrival Window**

```
          [ YOUR ARRIVAL WINDOW ]
|---------------------------------------------|
|                                             |
09:00                                       10:00
(earliest_start_time)                     (latest_start_time)
      |
      |
    09:20
  (Our "Sweet Spot"
  Target for the
  best recommendation)

```

### 2. The "From Activity" Journey (Your Departure Window)

This journey is defined by `earliest_end_time` and `latest_end_time` and is linked to your arrival.

* **`activity_earliest_end_time`:** The earliest you might leave.
* **`activity_latest_end_time`:** The absolute latest you're willing to depart.

#### How We Find Your "Best" Departure (The Smart Part)

This is where our API's logic really helps. The "best" departure time isn't just a random time in your window; **it depends on your recommended arrival time and your activity's duration.**

Our API automatically calculates your *actual* finish time from the recommended arrival and finds the best departure to match.

**Example:**

* Your "To Activity" recommendation has you **arriving at 09:20**.
* Your `activity_duration_minutes` is `180` (3 hours).
* Your `earliest_end_time` is `12:00`.

**Calculation:**

1.  **Actual Finish Time:** 09:20 (Arrival) + 3 hours (Duration) = **12:20**
2.  **Compare to Earliest End:** Your actual finish time of 12:20 is *after* your `earliest_end_time` of 12:00, so it's valid.
3.  **Find Departure:** The API will now search for the best departure connection starting at or around **12:20**.

This creates a seamless itinerary where your departure journey is perfectly timed to your arrival.

**Visualization: Your Connected Itinerary**

```
|------------------[ ARRIVAL ]------------------|-----------------|-----------------[ DEPARTURE WINDOW ]-----------------|
09:00             09:20                       10:00               12:00                                                14:00
(Earliest Start)  (Recommended                                (Earliest End)                                        (Latest End)
                   Arrival)
                      |
                      +------------- 3 Hour Activity Duration -------------+
                                                                           |
                                                                         12:20
                                                                       (Calculated
                                                                        Departure Time)
```

Because your calculated departure of 12:20 is *inside* your `[12:00 - 14:00]` window, the API will find the best connection leaving around **12:20**.

### 3. Smart Fallback: What If No Return Journey is Found?


What happens if your activity runs so late that no return journeys are available based on your "actual finish time"?

Our API has a smart fallback plan.

1.  **Find Last Chance:** The API will re-scan your "From Activity" window and find the **absolute latest departure connection** available before your `latest_end_time`.
2.  **Work Backwards:** It will then take that journey's departure time (e.g., 16:30) and subtract your activity duration (e.g., 3 hours). This gives a *new* mandatory arrival time (e.g., 13:30).
3.  **Re-Filter Arrival:** The API will re-filter your "To Activity" connections. It will now *only* show you arrivals that get you to the activity **before 13:30**, ensuring you can make that last train home.

This ensures that if a valid round-trip is *at all possible* within your windows, our API will find it.

---

## Loading Earlier / Later Connections (Scrolling)

The initial `/connections` response returns a scored and filtered batch of journeys centred around the activity's time window. Because the routing engine searches a fixed window per call, there are always more valid connections earlier and later that were not included. The four optional scroll parameters let you fetch additional batches on demand â€” for example, when the user taps "Show earlier connections" or "Show later connections" â€” without reloading the full response.

### The `has_more_*` Flags

Every `/connections` response (including the initial load) includes four booleans in the `connections` object that tell you whether more connections exist outside the current batch:

| Field                           | When `true`                                                 | When `false`                                | When `null`                                                                                                    |
|---------------------------------|-------------------------------------------------------------|---------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `has_more_before_to_activity`   | Earlier to-connections exist â†’ show "Load earlier" button   | Batch already starts at the window boundary | Not determinable this request â€” keep the last known value (direction skipped, or scroll-after returned empty)  |
| `has_more_after_to_activity`    | Later to-connections exist â†’ show "Load later" button       | Batch already ends at the window boundary   | Not determinable this request â€” keep the last known value (direction skipped, or scroll-before returned empty) |
| `has_more_before_from_activity` | Earlier from-connections exist â†’ show "Load earlier" button | Batch starts at the window boundary         | Not determinable this request â€” keep the last known value (direction skipped, or scroll-after returned empty)  |
| `has_more_after_from_activity`  | Later from-connections exist â†’ show "Load later" button     | Batch ends at the window boundary           | Not determinable this request â€” keep the last known value (direction skipped, or scroll-before returned empty) |

`null` is the signal to **preserve** the flag value from your previous response â€” it always means "we did not search this side in this request, so we cannot say whether connections exist there."

Use these flags to show or hide your scroll buttons after every response.

### Scroll Parameters

Send one scroll anchor per direction. The anchor is the `connection_start_timestamp` of the boundary connection in the **current** displayed list.

| Scenario | Parameter to add | Value |
|----------|-----------------|-------|
| Load earlier to-connections | `to_connections_before` | `connection_start_timestamp` of the **first** item in the current `to_activity` list |
| Load later to-connections | `to_connections_after` | `connection_start_timestamp` of the **last** item in the current `to_activity` list |
| Load earlier from-connections | `from_connections_before` | `connection_start_timestamp` of the **first** item in the current `from_activity` list |
| Load later from-connections | `from_connections_after` | `connection_start_timestamp` of the **last** item in the current `from_activity` list |

All scroll parameters are **ISO 8601 UTC datetimes** (e.g. `2026-05-10T06:30:00Z`).

**Constraint:** `to_connections_before` and `to_connections_after` are mutually exclusive â€” sending both returns HTTP `400`. Same rule applies to the `from_connections_*` pair.

### Direction Skipping

When only one direction's scroll param is provided, the API **does not call the routing provider for the other direction at all**. The response will therefore have:

- The other direction's array = `[]`
- Its `recommended_*_connection` = `null`
- Its `has_more_*` fields = `null`

This is intentional and efficient. Your client should **keep the connections it already has** from the previous response and only append / replace the new batch for the scrolled direction.

### Absolute Time Windows

Scroll requests are **not restricted** by the activity time window (`activity_earliest_start_time`, `activity_latest_start_time`, etc.). The only bounds enforced during scrolling are:

- **To-connections:** `connection_end_timestamp` (arrival at activity) must fall on the activity date â€” between midnight UTC of the activity date and midnight UTC of the following day.
- **From-connections:** `connection_start_timestamp` (departure from activity) must fall on the activity's end date â€” between midnight UTC of that date and midnight UTC of the following day.

This lets users scroll all the way to the first or last connection of the day, even if it falls far outside the original activity time window. On initial load (no scroll params), the standard activity-window filtering still applies.

The `has_more_*` flags are computed against these day-wide bounds during scrolling: `has_more_before = false` when the earliest arrival/departure in the batch is at or before midnight, and `has_more_after = false` when the latest is at or after the following midnight. In practice both flags are `true` for any non-empty batch mid-day; you will reach `false` only when the batch includes the very first or last service of the day.

Note that an empty scroll result sets the flag for the **searched** direction to `false` and the **opposite** direction to `null` (unknown â€” do not overwrite).

### End-to-End Example

**Step 1 â€” Initial load** (no scroll params):

```http
GET /connections?user_start_location=Wien+Meidling&...&activity_latest_start_time=14:00&...
Authorization: Bearer <token>
```

Response excerpt:
```json
{
  "connections": {
    "to_activity": [
      { "connection_id": 1, "connection_start_timestamp": "2026-05-10T06:40:00Z", ... },
      { "connection_id": 2, "connection_start_timestamp": "2026-05-10T07:10:00Z", ... },
      { "connection_id": 3, "connection_start_timestamp": "2026-05-10T07:55:00Z", ... }
    ],
    "recommended_to_activity_connection": 2,
    "has_more_before_to_activity": true,
    "has_more_after_to_activity": false,
    "from_activity": [ ... ],
    "recommended_from_activity_connection": 5,
    "has_more_before_from_activity": false,
    "has_more_after_from_activity": true
  }
}
```

UI state: show "Load earlier" for to-connections (before `06:40`), hide "Load later"; show "Load later" for from-connections, hide "Load earlier".

**Step 2 â€” User taps "Load earlier to-connections"**

Send the anchor as the departure of the first item in the current list (`06:40`):

```http
GET /connections?user_start_location=Wien+Meidling&...&to_connections_before=2026-05-10T06:40:00Z
Authorization: Bearer <token>
```

Response excerpt:
```json
{
  "connections": {
    "to_activity": [
      { "connection_id": 10, "connection_start_timestamp": "2026-05-10T05:55:00Z", ... },
      { "connection_id": 11, "connection_start_timestamp": "2026-05-10T06:25:00Z", ... }
    ],
    "recommended_to_activity_connection": 10,
    "has_more_before_to_activity": false,
    "has_more_after_to_activity": true,
    "from_activity": [],
    "recommended_from_activity_connection": null,
    "has_more_before_from_activity": null,
    "has_more_after_from_activity": null
  }
}
```

- `from_activity` is empty and all from-flags are `null` â†’ **do not touch** the from-connections already displayed; keep what you had.
- Prepend the two new to-connections to the displayed list.
- `has_more_before_to_activity: false` â†’ hide the "Load earlier" button; the window boundary has been reached.

---

## Understanding the Response

### Connections Response
#### Root Object
The response is a JSON object containing the following keys:
- `activity`: An object with activity details.
- `connections`: An object with `to_activity` and `from_activity` journeys.
- `live`: A boolean indicating if the connection used a realtime data provider.

#### `activity` Object
| Field                          | Type               | Description                                                                                           |
|--------------------------------|--------------------|-------------------------------------------------------------------------------------------------------|
| `name`                         | `string`           | Name of the activity.                                                                                 |
| `start_location`               | `string`           | Resolved coordinates of the activity start location (`"lat,lon"`).                                   |
| `start_location_type`          | `string`           | Type of the start location (always `"coordinates"` after geocoding).                                 |
| `start_location_display_name`  | `string` / `null`  | Human-readable name for the start location. Provided by the caller or resolved via geocoding.        |
| `end_location`                 | `string`           | Resolved coordinates of the activity end location (`"lat,lon"`).                                     |
| `end_location_type`            | `string`           | Type of the end location (always `"coordinates"` after geocoding).                                   |
| `end_location_display_name`    | `string` / `null`  | Human-readable name for the end location. Provided by the caller or resolved via geocoding.          |
| `timezone`                     | `string`           | IANA timezone identifier for the activity (e.g. `"Europe/Vienna"`).                                 |
| `date`                         | `string`           | Activity date in `YYYY-MM-DD` format.                                                                |
| `date_end`                     | `string` / `null`  | Last day of a multi-day activity in `YYYY-MM-DD` format. `null` for single-day activities.           |
| `duration_minutes`             | `integer`          | Activity duration in minutes.                                                                        |
| `duration_days`                | `integer` / `null` | Activity duration in days for multi-day activities. `null` for single-day activities.                |
| `earliest_start_time`          | `string`           | Earliest arrival time at the activity as ISO 8601 UTC datetime (e.g. `"2026-05-10T06:00:00Z"`).     |
| `latest_start_time`            | `string`           | Latest arrival time at the activity as ISO 8601 UTC datetime.                                        |
| `earliest_end_time`            | `string`           | Earliest departure time from the activity as ISO 8601 UTC datetime.                                  |
| `latest_end_time`              | `string`           | Latest departure time from the activity as ISO 8601 UTC datetime.                                    |
| `start_time_label`             | `string` / `null`  | Custom label for the activity start time (e.g. `"Check-in"`). `null` if not provided.               |
| `end_time_label`               | `string` / `null`  | Custom label for the activity end time (e.g. `"Check-out"`). `null` if not provided.                |


#### `connections` Object
| Field                                  | Type                 | Description                                                                                                                                                                     |
|----------------------------------------|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `to_activity`                          | `array`              | Array of journeys leading to the activity. Empty (`[]`) when the to-activity direction was skipped (scroll requests targeting only from-connections).                           |
| `recommended_to_activity_connection`   | `integer` / `null`   | Connection ID of the recommended to-activity connection. `null` when the to-activity direction was skipped in a scroll request.                                                 |
| `has_more_before_to_activity`          | `boolean` / `null`   | `true` if earlier to-connections exist (earliest arrival in batch is above the window floor). `false` means the window floor has been reached. `null` means not determinable this request â€” keep the last known value. |
| `has_more_after_to_activity`           | `boolean` / `null`   | `true` if later to-connections exist (latest arrival in batch is below the arrival deadline). `false` means the arrival deadline has been reached. `null` means not determinable this request â€” keep the last known value. |
| `from_activity`                        | `array`              | Array of journeys from the activity back to the user's start. Empty (`[]`) when the from-activity direction was skipped.                                                        |
| `recommended_from_activity_connection` | `integer` / `null`   | Connection ID of the recommended from-activity connection. `null` when skipped.                                                                                                 |
| `has_more_before_from_activity`        | `boolean` / `null`   | `true` if earlier from-connections exist (earliest departure in batch is above the window floor). `false` means the floor has been reached. `null` means not determinable this request â€” keep the last known value. |
| `has_more_after_from_activity`         | `boolean` / `null`   | `true` if later from-connections exist (latest departure in batch is below the window ceiling). `false` means the ceiling has been reached. `null` means not determinable this request â€” keep the last known value. |

#### Journey Object
Each journey in `to_activity`, `from_activity` (from `/connections`), or `connections` (from `/journey`) contains the following fields:

| Field                            | Type      | Description                                                                                                                                                                                                                                                               |
|----------------------------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `connection_id`                  | `integer` | Unique identifier for this connection within the list.                                                                                                                                                                                                                    |
| `connection_start_timestamp`     | `string`  | The start time of the journey in ISO 8601 format (UTC).                                                                                                                                                                                                                   |
| `connection_end_timestamp`       | `string`  | The end time of the journey in ISO 8601 format (UTC).                                                                                                                                                                                                                     |
| `connection_transfers`           | `integer` | The number of transfers in the journey.                                                                                                                                                                                                                                   |
| `connection_elements`            | `array`   | Array of `Connection Element` objects representing each step in the journey.                                                                                                                                                                                              |
| `connection_anytime`             | `boolean` | Indicates if the leg is time-independent (e.g., a walk).                                                                                                                                                                                                                  |
| `connection_ticketshop_provider` | `string`  | **(Optional)** Name of the primary ticketshop provider (e.g., "OEBB", "SBB", "TRAIVELLING"). This is the first available provider from `connection_ticketshop_segments`. `null` if no provider is available. **For backward compatibility, always check segments first.** |
| `connection_ticketshop_segments` | `array`   | **(Optional)** Array of `Ticketshop Segment` objects defining which provider covers which leg ranges. Only present when a ticketshop provider is available. See [Ticketshop Segment](#ticketshop-segment) below.                                                          |
| `connection_score`               | `float`   | Calculated score indicating the suitability of the connection (higher is better).                                                                                                                                                                                         |

#### Connection Element
A `Connection Element` represents a single step (e.g., train, bus, or transfer) in the journey. It contains the following:

| Field                       | Type      | Description                                                               |
|-----------------------------|-----------|---------------------------------------------------------------------------|
| `provider`                  | `string`  | Indicates which data provider was used for this leg (e.g. `"VAO"`, `"MOTIS"`). |
| `from_location`             | `string`  | The departure location name for this leg. Always a human-readable string â€” raw coordinate strings are never returned (the backend resolves display names from geocoding). |
| `from_location_coordinates` | `object`  | Coordinates of the departure location: `{"lat": float, "lon": float}`.   |
| `to_location`               | `string`  | The arrival location name for this leg. Always human-readable.            |
| `to_location_coordinates`   | `object`  | Coordinates of the arrival location: `{"lat": float, "lon": float}`.     |
| `departure_time`            | `string`  | The scheduled departure time in ISO 8601 format (UTC).                    |
| `arrival_time`              | `string`  | The scheduled arrival time in ISO 8601 format (UTC).                      |
| `duration`                  | `integer` | Duration of this leg in minutes.                                          |
| `type`                      | `string`  | The type of transport: `JNY` (transit journey), `WALK` (walking), `TRSF` (transfer). |
| `vehicle_name`              | `string`  | Optional. The name/number of the vehicle (e.g., `"RJX 560"`, `"U1"`).    |
| `vehicle_type`              | `integer` | Optional. The vehicle type returned as ID (see Vehicle Type Table below). |
| `n_intermediate_stops`      | `integer` | Optional. Number of intermediate stops during this leg.                   |
| `direction`                 | `string`  | Optional. End stop of this vehicle's trip (headsign/direction).           |
| `ext_id_orig`               | `string`  | Optional. External ID of the origin stop as returned by the provider.     |
| `ext_id_dest`               | `string`  | Optional. External ID of the destination stop as returned by the provider. |
| `platform_orig`             | `string`  | Optional. Departure platform at the origin stop.                          |
| `platform_dest`             | `string`  | Optional. Arrival platform at the destination stop.                       |
| `alerts`                    | `array`   | Optional. Array of service alerts for this leg (see Alert Object below).  |

**Note on ghost walks:** Multi-modal routing injects a short `WALK` leg from the user's provided coordinate to the nearest platform node. Because the user is already at that station (they selected it from autocomplete and sent coordinates), this walk is spurious and is removed server-side. Removal applies **only** at the user's position:
- **`to_activity` connections**: first leg only â€” if it is a `WALK`, endpoints are <200 m apart, â‰¤10 min, and the destination station name roughly matches `user_start_location_display_name` (or â‰¤5 min without a display name).
- **`from_activity` connections**: last leg only â€” same conditions in reverse.

The activity-side ends (last leg of `to_activity`, first leg of `from_activity`) are never modified. `connection_start_timestamp` / `connection_end_timestamp` are adjusted after removal.

##### Vehicle Type Table
All Vehicle Types are returned as a ID. Each ID corresponds to a specific vehicle type. The following table provides the mapping:

| ID | de              | en            | sl              | it          | fr          |
|---:|-----------------|---------------|-----------------|-------------|-------------|
|  1 | Zug             | Train         | Vlak            | Treno       | Train       |
|  2 | Bus             | Bus           | Avtobus         | Bus         | Bus         |
|  3 | StraÃŸenbahn     | Tram          | Tramvaj         | Tram        | Tramway     |
|  4 | U-Bahn          | Subway        | Metro           | Metro       | MÃ©tro       |
|  5 | Einschienenbahn | Monorail      | Monorail        | Monorotaia  | Monorail    |
|  6 | Zahnradbahn     | Cog Train     | Zobna Å¾eleznica | Cremagliera | CrÃ©maillÃ¨re |
|  7 | Standseilbahn   | Funicular     | Funicular       | Funicolare  | Funiculaire |
|  8 | Seilbahn        | Aerial Lift   | Å½iÄnica         | Funivia     | TÃ©lÃ©portÃ©   |
|  9 | FÃ¤hre           | Ferry         | Trajekt         | Traghetto   | Ferry       |
| 10 | Taxi            | Taxi          | Taksi           | Taxi        | Taxi        |
| 20 | Verschiedenes   | Miscellaneous | Raznovrsten     | Misto       | DiffÃ©rents  |
| 30 | Haus            | House         | HiÅ¡a            | Casa        | Maison      |
| 31 | StraÃŸe          | Street        | Ulica           | Strada      | Rue         |
| 32 | Platz           | Square        | Trg             | Piazza      | Place       |
| 33 | Park            | Park          | Park            | Parco       | Parc        |

##### Alert Object
Service alerts provide information about disruptions, delays, or other important notices for a leg. Alerts are based on the GTFS Realtime specification. Not every leg has alerts; they are only present when there is relevant service information.

| Field              | Type     | Description                                                                                                                |
|--------------------|----------|----------------------------------------------------------------------------------------------------------------------------|
| `cause`            | `string` | The cause of the alert. Possible values include: `UNKNOWN_CAUSE`, `OTHER_CAUSE`, `TECHNICAL_PROBLEM`, `STRIKE`, `DEMONSTRATION`, `ACCIDENT`, `HOLIDAY`, `WEATHER`, `MAINTENANCE`, `CONSTRUCTION`, `POLICE_ACTIVITY`, `MEDICAL_EMERGENCY`. |
| `effect`           | `string` | The effect of the alert. Possible values include: `NO_SERVICE`, `REDUCED_SERVICE`, `SIGNIFICANT_DELAYS`, `DETOUR`, `ADDITIONAL_SERVICE`, `MODIFIED_SERVICE`, `OTHER_EFFECT`, `UNKNOWN_EFFECT`, `STOP_MOVED`, `NO_EFFECT`, `ACCESSIBILITY_ISSUE`. |
| `header_text`      | `string` | Brief header/title text for the alert. May be empty if no header is provided.                                              |
| `description_text` | `string` | Detailed description of the alert with additional information (e.g., booking URLs, instructions).                          |

**Example Alert:**
```json
{
  "cause": "UNKNOWN_CAUSE",
  "effect": "OTHER_EFFECT",
  "header_text": "",
  "description_text": "Buchung und mehr Infos unter https://blaguss.com/reiseangebot/mit-dem-bus-zum-schnee#c4628"
}
```

#### Ticketshop Segment
A `Ticketshop Segment` defines which ticketshop provider covers a specific range of legs within a connection. This is particularly useful when a single connection requires multiple tickets from different providers, or when some legs (e.g., buses) are not covered by the available provider.

**Key Insight:** Some ticketshop providers (e.g., **Traivelling**) only support train journeys and do not cover buses. In such cases, a connection might be split into multiple segments:
- Segment 1: Legs 0-2 (trains) â†’ covered by TRAIVELLING
- Segment 2: Leg 3 (bus) â†’ `provider: null` (not covered)
- Segment 3: Legs 4-5 (trains) â†’ covered by TRAIVELLING

The client application must handle this by:
1. Showing which legs are covered by which provider
2. Informing users when certain legs (e.g., buses) have no ticket booking available
3. Calling `/generate-ticketshop-link` with the appropriate `segment_index` to get separate ticket links

| Field      | Type      | Description                                                                                                              |
|------------|-----------|--------------------------------------------------------------------------------------------------------------------------|
| `leg_from` | `integer` | Inclusive start index of the leg range in `connection_elements` (0-based).                                               |
| `leg_to`   | `integer` | Inclusive end index of the leg range in `connection_elements` (0-based).                                                 |
| `provider` | `string`  | Name of the ticketshop provider for this segment (e.g., "TRAIVELLING", "OEBB"). `null` if no provider covers these legs. |

**Example with Multiple Segments (Traivelling, Train + Bus + Train):**
```json
{
  "connection_ticketshop_provider": "TRAIVELLING",
  "connection_ticketshop_segments": [
    {
      "leg_from": 0,
      "leg_to": 1,
      "provider": "TRAIVELLING"
    },
    {
      "leg_from": 3,
      "leg_to": 3,
      "provider": null
    },
    {
      "leg_from": 5,
      "leg_to": 6,
      "provider": "TRAIVELLING"
    }
  ]
}
```

**Example with Single Provider (OEBB, supports all legs):**
```json
{
  "connection_ticketshop_provider": "OEBB",
  "connection_ticketshop_segments": [
    {
      "leg_from": 0,
      "leg_to": 5,
      "provider": "OEBB"
    }
  ]
}
```

---

### Journey Response
#### Root Object
The response is a JSON object containing the following keys:
- `journey_request`: An object echoing the validated request parameters.
- `connections`: An array of `Journey Object`s.
- `recommended_connection_id`: The `connection_id` of the best-scoring journey.

#### `journey_request` Object
This object echoes the parameters sent in the request, with defaults applied. See [Journey Parameters](#journey-parameters) for fields.

#### `connections` Array
This is an array of `Journey Object`s. See the [Journey Object](#journey-object) definition under the "Connections Response" section for the full structure.

---

### Address Autocomplete Response

The response is a GeoJSON `FeatureCollection` with enhanced properties in a new `diana_properties` object. If no matches are found for the query, the response will be an empty array. Each feature contains:

#### Feature Object Structure
```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [lon, lat]
  },
  "properties": {
    // Original Photon properties (see below)
  },
  "diana_properties": {
    // Enhanced properties (see below)
  }
}
```

#### Properties Object
| Field         | Type      | Description                                                          |
|---------------|-----------|----------------------------------------------------------------------|
| `name`        | `string`  | Display name of the location                                         |
| `street`      | `string`  | Street name (when applicable)                                        |
| `city`        | `string`  | City name                                                            |
| `district`    | `string`  | District/neighborhood                                                |
| `postcode`    | `string`  | Postal code                                                          |
| `country`     | `string`  | Country name                                                         |
| `countrycode` | `string`  | 2-letter country code                                                |
| `type`        | `string`  | Location type (house, street, locality, etc.)                        |
| `osm_id`      | `integer` | OpenStreetMap ID                                                     |
| `osm_type`    | `string`  | OSM element type (N=node, W=way, R=relation)                         |
| `osm_key`     | `string`  | OSM primary tag key                                                  |
| `osm_value`   | `string`  | OSM primary tag value                                                |
| `extent`      | `array`   | [Optional] Bounding box coordinates [minlon, minlat, maxlon, maxlat] |

#### Enhanced Properties (`diana_properties` object)
| Field           | Type      | Description                                                      |
|-----------------|-----------|------------------------------------------------------------------|
| `original_name` | `string`  | Preserves the original OSM name                                  |
| `display_name`  | `string`  | Optimized display format (e.g., "Stephansplatz 1, Vienna")       |
| `short_display` | `string`  | Compact version of display_name (currently identical)            |
| `location_type` | `string`  | Either `"address"` or `"station"`                                |
| `type_hint`     | `integer` | ID representing the location type (see Vehicle Type Table below) |

#### Display Name Logic
- **Stations and POIs** (`osm_key: railway`, `public_transport`, `tourism`, or `osm_value: station`):
  Format: `[name], [city]` (e.g., `"Wien Hauptbahnhof, Wien"`, `"Eiffel Tower, Paris"`).
  The station name always appears first. Multiple underlying OSM nodes for the same station (e.g. individual platform stop-position nodes) are automatically **clustered by name and position**: if all nodes with the same name/type share a centroid within 500 m, they are collapsed into a single result at the averaged coordinate. This means a search for "Wien Hauptbahnhof" returns one result rather than dozens of platform duplicates.
- **Addresses**:
  Format: `[street] [housenumber], [city]` (e.g., `"Mariahilfer StraÃŸe 5, Wien"`).
  Falls back to `[name], [city]` when no street is available, or to just `[name], [city]` when the street name is very long (>30 characters). Address nodes are not clustered.

#### Type Hint IDs (Vehicle Type Table)
Matches the same IDs used in Connections API (see above):

| ID  | Description   | Examples                   |
|-----|---------------|----------------------------|
| 1   | Train         | Railway stations           |
| 2   | Bus           | Bus stops                  |
| 3   | Tram          | Tram stops                 |
| 4   | Subway        | U-Bahn stations            |
| ... | ...           | ...                        |
| 30  | House         | Addresses with housenumber |
| 31  | Street        | Street segments            |
| 32  | Square        | Public squares             |
| 33  | Park          | Parks/leisure areas        |
| 20  | Miscellaneous | All other types            |

---

### Reverse Geocoding Response
The response is the same as the Address Autocomplete response. Only one feature is returned, representing the reverse geocoded location.
See [Address Autocomplete Response](#address-autocomplete-response) for details.

---

### Quota Check Response
The response is a JSON object containing the customer's quota configuration and current usage.

| Field                  | Type               | Description                                                                                                         |
|------------------------|--------------------|---------------------------------------------------------------------------------------------------------------------|
| `requests_this_month`  | `integer`          | Requests made by the customer in the current calendar month.                                                        |
| `monthly_quota`        | `integer`          | Monthly hard quota limit. Requests are rejected after `monthly_quota + soft_quota_overstep` requests per month.     |
| `requests_this_year`   | `integer`          | Requests made by the customer in the current calendar year.                                                         |
| `yearly_quota`         | `integer` / `null` | Yearly hard quota limit. `null` means no yearly cap is configured.                                                  |
| `soft_quota_overstep`  | `integer`          | Extra requests permitted beyond each hard quota before rejection. `0` = disabled (hard limit is strictly enforced). |
| `current_plans`        | `object`           | Dictionary of active plans/scopes and their descriptions.                                                           |

**Example (with yearly quota and soft quota):**
```json
{
  "requests_this_month": 95,
  "monthly_quota": 100,
  "requests_this_year": 850,
  "yearly_quota": 1000,
  "soft_quota_overstep": 20,
  "current_plans": {
    "starter_plan": "Starter-Plan: Free access to the Diana API",
    "realtime_at": "Access to realtime data in Austria"
  }
}
```

In this example the customer may still make up to **25** more requests this month (100 hard + 20 soft âˆ’ 95 used) and up to **170** more requests this year (1000 hard + 20 soft âˆ’ 850 used) before being rejected.

---

### Generate Ticketshop Link Response
On success, the response is a JSON object containing one or more generated deeplinks.

#### Response Fields
| Field              | Type     | Description                                                                                                                                                                                                            |
|--------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ticketshop_url`   | `string` | **(Backward Compatible)** The primary ticket shop URL. This is the first valid URL from `ticketshop_links`. Use this if you only need a single link and don't care about multi-segment scenarios.                      |
| `ticketshop_links` | `array`  | Array of `Ticketshop Link` objects, one per segment. Each object contains the `leg_from`, `leg_to`, `provider`, and `url` for a ticket segment. This is the **recommended** field for handling multi-segment journeys. |

#### Ticketshop Link Object
| Field      | Type      | Description                                                                                                  |
|------------|-----------|--------------------------------------------------------------------------------------------------------------|
| `leg_from` | `integer` | Inclusive start index of the leg range in `connection_elements` (0-based).                                   |
| `leg_to`   | `integer` | Inclusive end index of the leg range in `connection_elements` (0-based).                                     |
| `provider` | `string`  | Name of the ticketshop provider (e.g., "TRAIVELLING", "OEBB"). `null` if these legs have no ticket coverage. |
| `url`      | `string`  | The fully formed URL to the ticket shop for this segment. `null` if no provider covers these legs.           |

#### Response Behavior
- **Without `segment_index`** (default): Returns links for **all segments** with a provider. Segments without a provider (`provider: null`) are included with `url: null` to indicate which legs are not covered.
- **With `segment_index`**: Returns a link **only** for the specified segment. If that segment has no provider, an error is returned.

#### Example 1: Single Provider (OEBB)
All legs are covered by a single provider.

**Request:**
```json
POST /generate-ticketshop-link
{
  "connection_elements": [ /* OEBB connection */ ]
}
```

**Response:**
```json
{
  "ticketshop_url": "https://shop.oebbtickets.at/en/ticket?stationOrigName=Wien%20Hbf&...",
  "ticketshop_links": [
    {
      "leg_from": 0,
      "leg_to": 5,
      "provider": "OEBB",
      "url": "https://shop.oebbtickets.at/en/ticket?stationOrigName=Wien%20Hbf&..."
    }
  ]
}
```

#### Example 2: Multi-Segment (Traivelling, Train + Bus + Train)
Traivelling does not support buses, so the connection is split into multiple segments.

**Request:**
```json
POST /generate-ticketshop-link
{
  "connection_elements": [ /* Traivelling connection with bus leg */ ]
}
```

**Response:**
```json
{
  "ticketshop_url": "https://traivelling.com/connections?ref=ZUUG260113&originName=Berlin%20Hbf&...",
  "ticketshop_links": [
    {
      "leg_from": 0,
      "leg_to": 1,
      "provider": "TRAIVELLING",
      "url": "https://traivelling.com/connections?ref=ZUUG260113&originName=Berlin%20Hbf&..."
    },
    {
      "leg_from": 3,
      "leg_to": 3,
      "provider": null,
      "url": null
    },
    {
      "leg_from": 5,
      "leg_to": 6,
      "provider": "TRAIVELLING",
      "url": "https://traivelling.com/connections?ref=ZUUG260113&originName=Hamburg%20Hbf&..."
    }
  ]
}
```

**Interpretation:**
- Legs 0-1 (trains): Book via Traivelling
- Leg 3 (bus): No ticket booking available (`provider: null`)
- Legs 5-6 (trains): Book via Traivelling (separate ticket)

#### Example 3: Train + Transfer + Train (Single Segment)
When multiple train legs are separated only by transfers, they are combined into a single ticket segment:

**Request:**
```json
POST /generate-ticketshop-link
{
  "connection_elements": [
    { "type": "JNY", "vehicle_type": 1, ... },  // Leg 0: Train (Vienna â†’ Linz)
    { "type": "TRSF", ... },                     // Leg 1: Transfer (5 min walk)
    { "type": "JNY", "vehicle_type": 1, ... }   // Leg 2: Train (Linz â†’ Salzburg)
  ]
}
```

**Response:**
```json
{
  "ticketshop_url": "https://traivelling.com/connections?ref=ZUUG260113&originName=Vienna%20Hbf&destinationName=Salzburg%20Hbf&...",
  "ticketshop_links": [
    {
      "leg_from": 0,
      "leg_to": 2,
      "provider": "TRAIVELLING",
      "url": "https://traivelling.com/connections?ref=ZUUG260113&originName=Vienna%20Hbf&destinationName=Salzburg%20Hbf&..."
    }
  ]
}
```

**Interpretation:**
- Legs 0-2 (Train â†’ Transfer â†’ Train): Book as **ONE** ticket via Traivelling. The transfer does not break the segment.

#### Example 4: Requesting a Specific Segment
To get a link for only the second train segment (legs 5-6):

**Request:**
```json
POST /generate-ticketshop-link
{
  "connection_elements": [ /* Same as Example 2 */ ],
  "segment_index": 2
}
```

**Response:**
```json
{
  "ticketshop_url": "https://traivelling.com/connections?ref=ZUUG260113&originName=Hamburg%20Hbf&...",
  "ticketshop_links": [
    {
      "leg_from": 5,
      "leg_to": 6,
      "provider": "TRAIVELLING",
      "url": "https://traivelling.com/connections?ref=ZUUG260113&originName=Hamburg%20Hbf&..."
    }
  ]
}
```
---

### Share Journey Response
The response is a JSON object containing the unique ID for the created share link.

| Field     | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| `shareId` | `string` | The unique hash key for the shared journey. |

**Example:**
```json
{
  "shareId": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```

---

### Retrieve Shared Journey Response
The response is a JSON object containing the originally saved journey data. The structure mirrors the request body of the [Share Journey](#share-journey) endpoint.

- **`activity`**: The canonical activity object as stored when the share was created. `null` for share records created before this field was introduced â€” clients must handle `null` gracefully.
- **`origin_display_name`**: The human-readable display name for the user's start location. `null` for old share records.

**Example (new share record with all fields):**
```json
{
    "origin": "Wien Stephansplatz",
    "origin_display_name": "Stephansplatz (U), Wien",
    "origin_lat": 48.2084,
    "origin_lon": 16.3731,
    "date": "2024-09-15",
    "dateEnd": null,
    "to_connection_start_time": "2024-09-15T08:30:00Z",
    "to_connection_end_time": "2024-09-15T09:15:00Z",
    "from_connection_start_time": "2024-09-15T17:00:00Z",
    "from_connection_end_time": "2024-09-15T17:45:00Z",
    "shareURLPrefix": "https://example.com/planner",
    "activity": {
        "name": "Alpinpark Wiener Neustadt",
        "start_location": "47.7262,13.0422",
        "start_location_type": "coordinates",
        "start_location_display_name": "Alpinpark Wiener Neustadt",
        "end_location": "47.7049,13.0387",
        "end_location_type": "coordinates",
        "end_location_display_name": "Wiener Neustadt Hbf, Wiener Neustadt",
        "timezone": "Europe/Vienna",
        "date": "2024-09-15",
        "date_end": null,
        "duration_minutes": 480,
        "duration_days": null,
        "earliest_start_time": "2024-09-15T07:00:00Z",
        "latest_start_time": "2024-09-15T09:00:00Z",
        "earliest_end_time": "2024-09-15T15:00:00Z",
        "latest_end_time": "2024-09-15T18:00:00Z",
        "start_time_label": null,
        "end_time_label": null
    }
}
```

**Example (old share record, `activity` and `origin_display_name` absent):**
```json
{
    "origin": "Wien Stephansplatz",
    "origin_display_name": null,
    "origin_lat": 48.2084,
    "origin_lon": 16.3731,
    "date": "2024-09-15",
    "dateEnd": null,
    "to_connection_start_time": "2024-09-15T08:30:00Z",
    "to_connection_end_time": "2024-09-15T09:15:00Z",
    "from_connection_start_time": "2024-09-15T17:00:00Z",
    "from_connection_end_time": "2024-09-15T17:45:00Z",
    "shareURLPrefix": null,
    "activity": null
}
```
---

## Errors and Codes

Errors are generally returned with a relevant HTTP status code (e.g., 400, 401, 404, 429, 500).

### Standard Error Response Format
For errors identified by the application (typically 4xx status codes), the response body follows this JSON format:
```json
{
  "error": "[ERROR_MESSAGE]",
  "code": "[ERROR_CODE]"
}
```

### Error Code Table

| Code      | Text                                                                                                                                             | Log Error into Table |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
| 1001      | `Query parameter 'q' is missing`                                                                                                                 | No                   |
| 1002      | `Invalid limit parameter`                                                                                                                        | No                   |
| 1003      | `Failed to fetch autocomplete results.`                                                                                                          | Yes                  |
| 2001      | `Invalid coordinates format for user_start_location. Please use 'lat,lon'`                                                                       | No                   |
| 2002      | `Could not geocode user_start_location '[USER_START_LOCATION]'`                                                                                  | No                   |
| 2003      | `Failed to geocode user_start_location.`                                                                                                         | Yes                  |
| 2004      | `Unsupported user_start_location_type: '[USER_START_LOCATION_TYPE]'`                                                                             | No                   |
| 2005      | `Invalid coordinates format for activity_start_location. Please use 'lat,lon'`                                                                   | No                   |
| 2006      | `Could not geocode activity_start_location '[ACTIVITY_START_LOCATION]'`                                                                          | No                   |
| 2007      | `Failed to geocode activity_start_location.`                                                                                                     | Yes                  |
| 2008      | `Unsupported activity_start_location_type: '[ACTIVITY_START_LOCATION_TYPE]'`                                                                     | No                   |
| 2009      | `Invalid coordinates format for activity_end_location. Please use 'lat,lon'`                                                                     | No                   |
| 2010      | `Could not geocode activity_end_location '[ACTIVITY_END_LOCATION]'`                                                                              | No                   |
| 2011      | `Failed to geocode activity_end_location.`                                                                                                       | Yes                  |
| 2012      | `Unsupported activity_end_location_type: '[ACTIVITY_END_LOCATION_TYPE]'`                                                                         | No                   |
| 2017-1    | `No suitable connections found TO the activity`                                                                                                  | No                   |
| 2017-2    | `No suitable connections found FROM the activity`                                                                                                | No                   |
| 2017-2F   | `No suitable connections found FROM the activity today, even after fallback.`                                                                    | No                   |
| 2017-2F-1 | `No suitable connections found FROM the activity, even after fallback.`                                                                          | No                   |
| 2018-1    | `Connections found TO activity, but none met scoring criteria.`                                                                                  | No                   |
| 2018-2    | `Connections found FROM activity, but none met scoring criteria.`                                                                                | No                   |
| 2019-1    | `No suitable connections found TO the activity` (No connections found for TA segment; Merging might fail)                                        | No                   |
| 2019-2    | `No suitable connections found FROM the activity` (No connections found for TA segment; Merging might fail)                                      | No                   |
| 2020-1    | `No suitable connections found TO the activity` (No TA connections found or merging failed)                                                      | No                   |
| 2020-2    | `No suitable connections found FROM the activity` (No TA connections found or merging failed)                                                    | No                   |
| 2021-1    | `No suitable connections found TO the activity within the specified time window.`                                                                | No                   |
| 2021-2    | `No suitable connections found FROM the activity within the specified time window.`                                                              | No                   |
| 2022-1    | `No suitable connections found TO the activity departing after current time.`                                                                    | No                   |
| 2023-1    | `No suitable connections found TO the activity.` (All filtered out by duration)                                                                  | No                   |
| 2023-2    | `No suitable connections found FROM the activity.` (All filtered out by duration)                                                                | No                   |
| 2024      | `Found return connections, but no incoming connection arrives early enough to make the latest return. Try adjusting activity duration or times.` | No                   |
| 2025-1    | `Error calculating connections to activity.`                                                                                                     | Yes                  |
| 2025-2    | `Error calculating connections from activity.`                                                                                                   | Yes                  |
| 2026-1    | `Internal error finding recommended 'to activity' connection.`                                                                                   | Yes                  |
| 2027      | `No suitable public transport stations could be found near the specified address.`                                                               | No                   |
| 3001      | `Internal error calculating connections to activity.` (Error while fetching connections from provider)                                           | Yes                  |
| 3002      | `Internal error calculating connections from activity.` (Error while fetching connections from provider)                                         | Yes                  |
| 3003      | `Internal error calculating connections from activity.` (Error while fetching connections from provider, but inside fallback)                    | Yes                  |
| 3004      | `Internal error processing fallback results.`                                                                                                    | Yes                  |
| 4001      | `Latitude and longitude parameters are required`                                                                                                 | No                   |
| 4002      | `Failed to fetch reverse geocode results.`                                                                                                       | Yes                  |
| 5001      | `This shared link is invalid or has expired.`                                                                                                    | No                   |
| 5002      | `An unexpected error occurred while retrieving the shared journey.`                                                                              | Yes                  |
| 6001      | `Monthly quota exceeded`                                                                                                                         | No                   |
| 6002      | `Yearly quota exceeded`                                                                                                                          | No                   |
| 7001      | `connection_elements cannot be empty.`                                                                                                           | No                   |
| 7002      | `Missing coordinates in connection elements.`                                                                                                    | No                   |
| 7003      | `No ticketshop provider available for this connection.`                                                                                          | No                   |
| 7004      | `Could not extract necessary details from connection elements.`                                                                                  | No                   |
| 7005      | `Failed to generate ticketshop URL.`                                                                                                             | Yes                  |
| 7006      | `An unexpected error occurred during link generation.`                                                                                           | Yes                  |
| 7007      | `segment_index [INDEX] is out of range (0-[MAX]).`                                                                                               | No                   |
| 7008      | `The requested segment has no ticketshop provider.`                                                                                              | No                   |
| 8001      | `Invalid coordinates format for from_location. Please use 'lat,lon'`                                                                             | No                   |
| 8002      | `Could not geocode from_location '[FROM_LOCATION]'`                                                                                              | No                   |
| 8003      | `Failed to geocode from_location.`                                                                                                               | Yes                  |
| 8004      | `Unsupported from_location_type: '[FROM_LOCATION_TYPE]'`                                                                                         | No                   |
| 8005      | `Invalid coordinates format for to_location. Please use 'lat,lon'`                                                                               | No                   |
| 8006      | `Could not geocode to_location '[TO_LOCATION]'`                                                                                                  | No                   |
| 8007      | `Failed to geocode to_location.`                                                                                                                 | Yes                  |
| 8008      | `Unsupported to_location_type: '[TO_LOCATION_TYPE]'`                                                                                             | No                   |
| 8010      | `Internal error calculating connections.`                                                                                                        | Yes                  |
| 8011      | `No connections found for the specified route and time.`                                                                                         | No                   |
| 8012      | `No connections found departing in the future.`                                                                                                  | No                   |

---

## Example Usage

### Connections Example (Initial Load)
```http
GET /connections?user_start_location=48.2004,16.3697&user_start_location_type=coordinates&user_start_location_display_name=Wien%20Karlsplatz%20(U)%2C%20Wien&activity_name=Hiking%20Rax&activity_start_location=47.715575,15.804045&activity_start_location_type=coordinates&activity_end_location=47.682191,15.644807&activity_end_location_type=coordinates&activity_earliest_start_time=08:00&activity_latest_start_time=10:00&activity_earliest_end_time=16:00&activity_latest_end_time=18:00&activity_duration_minutes=210&timezone=Europe%2FVienna
Authorization: Bearer [token]
```

> `user_start_location_display_name` and `timezone` are strongly recommended. `user_start_location_display_name` should be the `diana_properties.display_name` of the autocomplete result the user selected.

### Connections Example (Scroll â€” Load Earlier To-Connections)
All standard parameters must be repeated. Add `to_connections_before` anchored to the earliest `connection_start_timestamp` in the current to-connections list.

```http
GET /connections?user_start_location=48.2004,16.3697&user_start_location_type=coordinates&user_start_location_display_name=Wien%20Karlsplatz%20(U)%2C%20Wien&activity_name=Hiking%20Rax&activity_start_location=47.715575,15.804045&activity_start_location_type=coordinates&activity_end_location=47.682191,15.644807&activity_end_location_type=coordinates&activity_earliest_start_time=08:00&activity_latest_start_time=10:00&activity_earliest_end_time=16:00&activity_latest_end_time=18:00&activity_duration_minutes=210&timezone=Europe%2FVienna&to_connections_before=2026-05-10T06:40:00Z
Authorization: Bearer [token]
```

> The response will have `from_activity: []` and all `has_more_*_from_*` fields `null`. Keep the from-connections from the previous response unchanged.

### Journey Example
```http
GET /journey?from_location=Stephansplatz, Wien&to_location=Wien Hauptbahnhof&date=2025-11-20&time=14:30:00&is_arrival=false
Authorization: Bearer [token]
```

### Address Autocomplete Example
```http
GET /address-autocomplete?q=Wien%20Step&hint_lat=48.208&hint_lon=16.373
Authorization: Bearer [token]
```

### Generate Ticketshop Link Example
```http
POST /generate-ticketshop-link
Authorization: Bearer [token]
Content-Type: application/json

{
    "connection_elements": [
        {
            "provider": "VAO",
            "from_location": "Wien Karlsplatz (U)",
            "from_location_coordinates": {"lat": 48.2004, "lon": 16.3697},
            "to_location": "Wien Hbf",
            "to_location_coordinates": {"lat": 48.1852, "lon": 16.3757},
            "departure_time": "2024-09-15T08:30:00Z",
            "arrival_time": "2024-09-15T08:35:00Z",
            "duration": 5,
            "vehicle_name": "U1",
            "type": "JNY"
        },
        {
            "provider": "VAO",
            "from_location": "Wien Hbf",
            "from_location_coordinates": {"lat": 48.1852, "lon": 16.3757},
            "to_location": "Payerbach-Reichenau Bahnhof",
            "to_location_coordinates": {"lat": 47.694, "lon": 15.861},
            "departure_time": "2024-09-15T08:55:00Z",
            "arrival_time": "2024-09-15T09:58:00Z",
            "duration": 63,
            "vehicle_name": "RJ 557",
            "type": "JNY"
        }
    ]
}

```

### Share Journey Example
```http
POST /share/
Authorization: Bearer [token]
Content-Type: application/json

{
    "origin": "Wien Karlsplatz",
    "origin_display_name": "Wien Karlsplatz (U), Wien",
    "origin_lat": 48.2004,
    "origin_lon": 16.3697,
    "date": "2024-09-15",
    "to_connection_start_time": "2024-09-15T08:30:00Z",
    "to_connection_end_time": "2024-09-15T09:15:00Z",
    "from_connection_start_time": "2024-09-15T17:00:00Z",
    "from_connection_end_time": "2024-09-15T17:45:00Z",
    "activity": {
        "name": "Hiking Rax",
        "start_location": "47.7156,15.804",
        "start_location_type": "coordinates",
        "start_location_display_name": "Rax Seilbahn Talstation",
        "end_location": "47.6822,15.6448",
        "end_location_type": "coordinates",
        "end_location_display_name": "Reichenau an der Rax Bahnhof, Reichenau an der Rax",
        "timezone": "Europe/Vienna",
        "date": "2024-09-15",
        "date_end": null,
        "duration_minutes": 210,
        "duration_days": null,
        "earliest_start_time": "2024-09-15T06:00:00Z",
        "latest_start_time": "2024-09-15T08:00:00Z",
        "earliest_end_time": "2024-09-15T14:00:00Z",
        "latest_end_time": "2024-09-15T16:00:00Z",
        "start_time_label": null,
        "end_time_label": null
    }
}
```

### Retrieve Shared Journey Example
```http
GET /share/a1b2c3d4-e5f6-7890-1234-567890abcdef/
Authorization: Bearer [token]
```

For complete examples, see the Postman collection at [Diana API Postman Collection](./Diana%20API.postman_collection.json).

---

## Troubleshooting & Edge Cases

1. **Invalid Coordinates**:
   - Returns `400` error with message: `Invalid coordinates format for [location]. Please use lat,lon` (Code: 2001, 2005, 2009, 8001, 8005)

2. **No Connections Found**:
   - Returns `404` error with relevant message (Codes: 2017, 2018, 2019, 2022, 2023, 8011, 8012)
   - Maybe due to:
     - No connections fitting the time windows (EST-LST, EET-LET).
     - Calculated duration preventing a valid return journey even with fallback logic.
     - Check activity times, duration, and date.

3. **Authentication Errors**:
   - Returns `401 Unauthorized` for missing, invalid, or expired authentication tokens.
   - Ensure the `Authorization` header includes a valid `Bearer [token]`.

4. **Quota Exceeded**:
   - **Monthly quota exceeded** â€“ returns `429 Too Many Requests` with error code `6001`.
   - **Yearly quota exceeded** â€“ returns `429 Too Many Requests` with error code `6002`.
   - The monthly limit is always evaluated first. If both limits are set and the monthly ceiling is hit first, the response will carry code `6001` even if the yearly ceiling has not yet been reached.
   - A soft-quota overstep (`soft_quota_overstep > 0`) extends the effective ceiling above the hard quota for both limits. Requests are still allowed within the soft window; only after the soft ceiling is surpassed is the request rejected.
   - These codes apply to free-tier (Starter-Plan) users on the `/connections` and `/journey` endpoints.
   - Pro-Plan users are not subject to quota limits.

5. **Location Not Found / Geocoding Failed**:
   - Returns `400` error if a provided location name cannot be geocoded (Codes: 2002, 2006, 2010, 8002, 8006).
   - Returns `500` error if the geocoding service itself fails (Codes: 2003, 2007, 2011, 8003, 8007).

6. **Shared Link Invalid or Expired**:
   - Returns `404` error with message: `This shared link is invalid or has expired.` (Code: 5001)

7. **Incomplete Data in Response**:
   - Missing optional fields in the response (e.g., `vehicle_name`) might be returned as `null` or omitted.
   - Client applications should handle null/missing values gracefully (e.g., display "N/A").

8. **Mutually Exclusive Scroll Parameters**:
   - Sending both `to_connections_before` **and** `to_connections_after` in the same request returns HTTP `400`.
   - The same applies to `from_connections_before` + `from_connections_after`.
   - You can freely combine one to-param with one from-param in the same request (e.g. `to_connections_before` + `from_connections_after`).

9. **`null` on `has_more_*` flags â€” two causes**:
   - **Direction skipped:** When only one direction's scroll param is sent, the other direction returns `[]` with `recommended_*: null` and both its `has_more_*` flags as `null`. Do not clear those connections from your UI.
   - **Empty scroll in the searched direction:** When a scroll-before request returns no results, `has_more_before = false` (nothing found before the anchor) but `has_more_after = null` â€” the search only went backward and cannot say whether connections exist after the anchor. Symmetrically, an empty scroll-after sets `has_more_after = false` and `has_more_before = null`.
   - In both cases: `null` means **"keep the last known value from your previous response"** â€” never interpret it as `false`.

10. **Date Handling**:
    - If `date` is not provided for a connection search, the current date (UTC) is used.
    - Date must be in `YYYY-MM-DD` format.
    - All times sent and received are UTC. The `timezone` parameter carries the activity's IANA timezone identifier and is echoed back in the `activity` object for display-layer use. The widget converts local activity times to UTC using this timezone before sending them to the API.