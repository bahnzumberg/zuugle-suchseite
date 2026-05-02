# API_DOCUMENTATION

## Comprehensive API Documentation for the `Diana` API

This document provides all the details necessary for a developer to integrate the `Diana` API into applications. It includes endpoints for travel connections, address autocomplete, and journey sharing functionality.

PDF available under: [Diana_API_Docs.pdf](https://diana.zuugle-services.net/docs/Diana_API_Docs.pdf)

---

## Table of Contents

1.  [Overview](#overview)
2.  [Endpoint Details](#endpoint-details)
    - [Connections](#connections)
    - [Journey](#journey)
    - [Address Autocomplete](#address-autocomplete)
    - [Reverse Geocoding](#reverse-geocoding)
    - [Quota Check](#quota-check)
    - [Generate Ticketshop Link](#generate-ticketshop-link)
    - [Share Journey](#share-journey)
    - [Retrieve Shared Journey](#retrieve-shared-journey)
3.  [Request Parameters](#request-parameters)
4.  [Guide: Using Activity Time Parameters](#guide-using-activity-time-parameters)
5.  [Understanding the Response](#understanding-the-response)
    - [Connections Response](#connections-response)
    - [Journey Response](#journey-response)
    - [Address Autocomplete Response](#address-autocomplete-response)
    - [Reverse Geocoding Response](#reverse-geocoding-response)
    - [Quota Check Response](#quota-check-response)
    - [Generate Ticketshop Link Response](#generate-ticketshop-link-response)
    - [Share Journey Response](#share-journey-response)
    - [Retrieve Shared Journey Response](#retrieve-shared-journey-response)
6.  [Errors and Codes](#errors-and-codes)
7.  [Example Usage](#example-usage)
8.  [Troubleshooting & Edge Cases](#troubleshooting--edge-cases)

---

## Overview

The `Diana` API provides:

1.  Detailed, real-time travel information to and from specified activities (`/connections`).
2.  Simple A-to-B route planning (`/journey`).
3.  Address autocomplete functionality for location searches (`/address-autocomplete`).
4.  Reverse geocoding capabilities (`/reverse-geocode`).
5.  Customer quota and plan status (`/quota`).
6.  On-demand ticketshop link generation for specific journeys (`/generate-ticketshop-link`).
7.  The ability to create and retrieve shareable journey links (`/share/...`).

All timestamps sent to or received from the API are in UTC. API usage may be subject to a monthly quota.

---

## Endpoint Details

### Connections

#### **HTTP Method**: `GET`

#### **URL**: `/connections`

#### **Authentication**:

- **OAuth 2.0** with `read_diana` scope
- **Bearer Token** must be included in the `Authorization` header: `Bearer [token]`

Calculates optimal travel journeys to and from a dynamically defined activity. The activity's details (locations, times, duration) are passed directly as request parameters. Implements fallback logic to find the latest possible return journey if the initially calculated timeline yields no results. All time parameters must be sent in UTC.

**Note:** The time parameters for this endpoint are highly flexible. See the "[Guide: Using Activity Time Parameters](#guide-using-activity-time-parameters)" section for a detailed explanation of how they work.

#### **Monthly Quota**

Starter-Plan users are limited to a monthly request quota on this endpoint.

- A standard request counts as **1** towards the quota.
- Exceeding this quota will result in an error response (see [Errors and Codes](#errors-and-codes)).

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

#### **Monthly Quota**

This endpoint shares the same monthly quota as the `/connections` endpoint for Starter-Plan users. Each request counts as **1** towards the quota.

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

- Provider: OEBB
  - Countries Covered: Austria
  - Supports All Transport Types?: ✅ Yes (trains, buses, etc.)
- Provider: SBB
  - Countries Covered: Switzerland
  - Supports All Transport Types?: ✅ Yes (trains, buses, etc.)
- Provider: TRAIVELLING
  - Countries Covered: All other European countries (Germany, France, Italy, Spain, Netherlands, Belgium, Czech Republic, Poland, etc.)
  - Supports All Transport Types?: ❌ No (trains only, no buses)

**Important:** Because **Traivelling does not support bus routes**, connections with bus legs may be split into multiple ticket segments. **However, transfers (walk/transfer legs) do NOT break segment continuity** - multiple train legs separated only by transfers are booked as a single ticket. For example:

- Train → Transfer → Train → **Single Traivelling ticket** (one combined booking)
- Train → Bus → Train → **Multiple segments** (separate tickets for the two train segments)
- Bus segment → **No ticket available** (`provider: null`)

The response includes a `connection_ticketshop_segments` array that clearly indicates which legs are covered by which provider. See [Ticketshop Segment](#ticketshop-segment) for details.

#### **HTTP Method**: `POST`

#### **Authentication**:

- **OAuth 2.0** with `read_diana` scope
- **Bearer Token** must be included in the `Authorization` header: `Bearer [token]`

Creates a unique, shareable link for a specified journey by saving its data. Returns a unique hash ID.

### Retrieve Shared Journey

#### **HTTP Method**: `GET`

#### **URL**: `/share/<hash_key>`

#### **Authentication**:

- **OAuth 2.0** with `read_diana` scope
- **Bearer Token** must be included in the `Authorization` header: `Bearer [token]`

Retrieves the data for a previously shared journey using its unique hash key.

---

## Request Parameters

### Connections Parameters

The activity is defined directly via query parameters.

- Parameter: id
  - Type: integer
  - Required: No
  - Default: -1
  - Description: Activity ID. Defaults to -1, indicating a dynamically defined activity via the parameters below.
- Parameter: user_start_location
  - Type: string
  - Required: Yes
  - Default: -
  - Description: The user's starting location. Can be an address, station name, or coordinates (format: lat,lon).
- Parameter: date
  - Type: string
  - Required: No
  - Default: Current date (UTC)
  - Description: The travel date in YYYY-MM-DD format (interpreted as UTC).
- Parameter: user_start_location_type
  - Type: string
  - Required: No
  - Default: address
  - Description: Specifies the type of user_start_location. Values: address, station, coordinates, coord, coords.
- Parameter: activity_name
  - Type: string
  - Required: Yes
  - Default: -
  - Description: A name for the activity.
- Parameter: activity_start_location
  - Type: string
  - Required: Yes
  - Default: -
  - Description: The starting location of the activity. Can be an address, station name, or coordinates.
- Parameter: activity_start_location_type
  - Type: string
  - Required: No
  - Default: address
  - Description: Specifies the type of activity_start_location. Values: address, station, coordinates, coord, coords.
- Parameter: activity_end_location
  - Type: string
  - Required: Yes
  - Default: -
  - Description: The ending location of the activity. Can be an address, station name, or coordinates.
- Parameter: activity_end_location_type
  - Type: string
  - Required: No
  - Default: address
  - Description: Specifies the type of activity_end_location. Values: address, station, coordinates, coord, coords.
- Parameter: activity_earliest_start_time
  - Type: time
  - Required: Yes
  - Default: -
  - Description: The earliest start time of the activity in HH:MM:SS format (UTC).
- Parameter: activity_latest_start_time
  - Type: time
  - Required: Yes
  - Default: -
  - Description: The latest start time of the activity in HH:MM or HH:MM:SS format (UTC).
- Parameter: activity_earliest_end_time
  - Type: time
  - Required: Yes
  - Default: -
  - Description: The earliest end time of the activity in HH:MM or HH:MM:SS format (UTC).
- Parameter: activity_latest_end_time
  - Type: time
  - Required: Yes
  - Default: -
  - Description: The latest end time of the activity in HH:MM:SS format (UTC).
- Parameter: activity_duration_minutes
  - Type: integer
  - Required: Yes
  - Default: -
  - Description: The duration of the activity in minutes.
- Parameter: activity_duration_days
  - Type: integer
  - Required: No
  - Default: 1
  - Description: The duration of the activity in days. Minimum value is 1.

### Journey Parameters

- Parameter: from_location
  - Type: string
  - Required: Yes
  - Default: -
  - Description: The starting location. Can be an address, station name, or coordinates (format: lat,lon).
- Parameter: from_location_type
  - Type: string
  - Required: No
  - Default: address
  - Description: Specifies the type of from_location. Values: address, station, coordinates, coord, coords.
- Parameter: to_location
  - Type: string
  - Required: Yes
  - Default: -
  - Description: The destination location. Can be an address, station name, or coordinates.
- Parameter: to_location_type
  - Type: string
  - Required: No
  - Default: address
  - Description: Specifies the type of to_location. Values: address, station, coordinates, coord, coords.
- Parameter: date
  - Type: string
  - Required: No
  - Default: Current date
  - Description: The travel date in YYYY-MM-DD format (interpreted as UTC). Defaults to today.
- Parameter: time
  - Type: time
  - Required: No
  - Default: Current time
  - Description: The travel time in HH:MM or HH:MM:SS format (UTC). Defaults to now.
- Parameter: is_arrival
  - Type: boolean
  - Required: No
  - Default: false
  - Description: If true, the time parameter specifies the desired arrival time. If false (default), it specifies the departure time.

### Address Autocomplete Parameters

| Parameter     | Type    | Required | Description                                                        |
| ------------- | ------- | -------- | ------------------------------------------------------------------ |
| q             | string  | Yes      | Search query for address autocomplete (e.g., "Wien Step")          |
| limit         | integer | No       | Maximum number of results to return (default: 5)                   |
| hint_lat      | float   | No       | Latitude hint for location bias                                    |
| hint_lon      | float   | No       | Longitude hint for location bias                                   |
| lang          | string  | No       | Language preference for results (en, de, fr). Defaults to default. |
| global_search | boolean | No       | If true, performs a global search without location bias.           |

### Reverse Geocoding Parameters

| Parameter | Type  | Required | Description                                  |
| --------- | ----- | -------- | -------------------------------------------- |
| lat       | float | Yes      | Latitude of the location to reverse geocode  |
| lon       | float | Yes      | Longitude of the location to reverse geocode |

### Generate Ticketshop Link Parameters (Request Body)

- Parameter: connection_elements
  - Type: array
  - Required: Yes
  - Description: An array of Connection Element objects, exactly as received from the /connections or /journey endpoint for a journey.
- Parameter: segment_index
  - Type: integer
  - Required: No
  - Description: (Optional) Index into connection_ticketshop_segments (0-based). If provided, generates a link only for the specified segment. If omitted, generates links for all segments with a provider (see response format below). Use this when you need a specific ticket for a leg range.

- Parameter: origin
  - Type: string
  - Required: Yes
  - Description: The starting location name for the shared journey.
- Parameter: origin_lat
  - Type: float
  - Required: No
  - Description: The latitude of the origin.
- Parameter: origin_lon
  - Type: float
  - Required: No
  - Description: The longitude of the origin.
- Parameter: date
  - Type: date
  - Required: Yes
  - Description: The start date of the journey (YYYY-MM-DD).
- Parameter: dateEnd
  - Type: date
  - Required: No
  - Description: The end date of the journey (YYYY-MM-DD), if it spans multiple days.
- Parameter: to_connection_start_time
  - Type: datetime
  - Required: No
  - Description: The full start timestamp of the journey to the activity (ISO 8601).
- Parameter: to_connection_end_time
  - Type: datetime
  - Required: No
  - Description: The full end timestamp of the journey to the activity (ISO 8601).
- Parameter: from_connection_start_time
  - Type: datetime
  - Required: No
  - Description: The full start timestamp of the journey from the activity (ISO 8601).
- Parameter: from_connection_end_time
  - Type: datetime
  - Required: No
  - Description: The full end timestamp of the journey from the activity (ISO 8601).
- Parameter: shareURLPrefix
  - Type: url
  - Required: No
  - Description: The base URL of the client application where the share was initiated.

### Retrieve Shared Journey Parameters (URL)

| Parameter | Type   | Required | Description                                     |
| --------- | ------ | -------- | ----------------------------------------------- |
| hash_key  | string | Yes      | The unique hash identifying the shared journey. |

---

## Guide: Using Activity Time Parameters

To help you find the perfect journey, our API asks for four key time parameters for your activity.

Think of these not as _exact_ times, but as the **flexible windows** you are available. This guide will show you how to set them and how our API uses them to find the best recommended journey for you.

The four parameters are:

- `activity_earliest_start_time`: The _earliest_ you are willing to **arrive** at your activity.
- `activity_latest_start_time`: The _latest_ you must **arrive** (e.g., when the activity officially begins).
- `activity_earliest_end_time`: The _earliest_ you are willing to **depart** from your activity.
- `activity_latest_end_time`: The _latest_ you are willing to **depart**.

### 1\. The "To Activity" Journey (Your Arrival Window)

This journey is defined by `earliest_start_time` and `latest_start_time`.

- **`activity_latest_start_time`:** This is your hard deadline. If your event starts at 10:00, set this to `10:00`. The API will _not_ recommend any journey that arrives after this time.
- **`activity_earliest_start_time`:** This is your "buffer." If your event is at 10:00, you might be willing to arrive as early as 09:00 to grab a coffee. Setting this to `09:00` gives the API more options.

#### How We Find Your "Best" Arrival

Our API searches for all connections that arrive _within_ your window. The "best" (recommended) connection is **not** the one that arrives at the last possible second.

Instead, we find a "sweet spot" that gives you a comfortable buffer without making you wait too long. We generally aim for a time about **one-third of the way into your arrival window**, but later options are also considered.

**Example:**

- `earliest_start_time`: `09:00`
- `latest_start_time`: `10:00`
- Your Window: A 60-minute arrival window.
- **Our "Sweet Spot" Target:** `09:20` (20 minutes after your earliest time)

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

### 2\. The "From Activity" Journey (Your Departure Window)

This journey is defined by `earliest_end_time` and `latest_end_time` and is linked to your arrival.

- **`activity_earliest_end_time`:** The earliest you might leave.
- **`activity_latest_end_time`:** The absolute latest you're willing to depart.

#### How We Find Your "Best" Departure (The Smart Part)

This is where our API's logic really helps. The "best" departure time isn't just a random time in your window; **it depends on your recommended arrival time and your activity's duration.**

Our API automatically calculates your _actual_ finish time from the recommended arrival and finds the best departure to match.

**Example:**

- Your "To Activity" recommendation has you **arriving at 09:20**.
- Your `activity_duration_minutes` is `180` (3 hours).
- Your `earliest_end_time` is `12:00`.

**Calculation:**

1.  **Actual Finish Time:** 09:20 (Arrival) + 3 hours (Duration) = **12:20**
2.  **Compare to Earliest End:** Your actual finish time of 12:20 is _after_ your `earliest_end_time` of 12:00, so it's valid.
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

Because your calculated departure of 12:20 is _inside_ your `[12:00 - 14:00]` window, the API will find the best connection leaving around **12:20**.

### 3\. Smart Fallback: What If No Return Journey is Found?

What happens if your activity runs so late that no return journeys are available based on your "actual finish time"?

Our API has a smart fallback plan.

1.  **Find Last Chance:** The API will re-scan your "From Activity" window and find the **absolute latest departure connection** available before your `latest_end_time`.
2.  **Work Backwards:** It will then take that journey's departure time (e.g., 16:30) and subtract your activity duration (e.g., 3 hours). This gives a _new_ mandatory arrival time (e.g., 13:30).
3.  **Re-Filter Arrival:** The API will re-filter your "To Activity" connections. It will now _only_ show you arrivals that get you to the activity **before 13:30**, ensuring you can make that last train home.

This ensures that if a valid round-trip is _at all possible_ within your windows, our API will find it.

---

## Understanding the Response

### Connections Response

#### Root Object

The response is a JSON object containing the following keys:

- `activity`: An object with activity details.
- `connections`: An object with `to_activity` and `from_activity` journeys.
- `live`: A boolean indicating if the connection used a realtime data provider.

#### `activity` Object

- Field: activity_id
  - Type: integer
  - Description: Unique identifier for the activity
- Field: activity_name
  - Type: string
  - Description: Name of the activity
- Field: activity_start_location
  - Type: string
  - Description: Starting location of the activity
- Field: activity_start_location_display_name
  - Type: string
  - Description: Display name for the starting location (if applicable)
- Field: activity_start_location_type
  - Type: string
  - Description: Type of the starting location (e.g., "address", "coordinates")
- Field: activity_end_location
  - Type: string
  - Description: Ending location of the activity
- Field: activity_end_location_display_name
  - Type: string
  - Description: Display name for the ending location (if applicable)
- Field: activity_end_location_type
  - Type: string
  - Description: Type of the ending location (e.g., "address", "coordinates")
- Field: activity_earliest_start_time
  - Type: time
  - Description: The earliest start time of the activity in HH:MM:SS format (UTC).
- Field: activity_latest_start_time
  - Type: time
  - Description: The latest start time of the activity in HH:MM or HH:MM:SS format (UTC).
- Field: activity_earliest_end_time
  - Type: time
  - Description: The earliest end time of the activity in HH:MM or HH:MM:SS format (UTC).
- Field: activity_latest_end_time
  - Type: time
  - Description: The latest end time of the activity in HH:MM:SS format (UTC).
- Field: activity_duration_minutes
  - Type: integer
  - Description: Duration of the activity in minutes
- Field: activity_duration_days
  - Type: integer
  - Description: Duration of the activity in days.
- Field: activity_start_time_label
  - Type: string
  - Description: Custom label for the start time (if applicable), e.g. for hotel check-in
- Field: activity_end_time_label
  - Type: string
  - Description: Custom label for the end time (if applicable), e.g. for hotel check-out

#### `connections` Object

- Field: to_activity
  - Type: array
  - Description: Array of journeys leading to the activity.
- Field: recommended_to_activity_connection
  - Type: integer
  - Description: Connection ID of the recommended connection in to_activity array.
- Field: from_activity
  - Type: array
  - Description: Array of journeys leading back from the activity to the starting location.
- Field: recommended_from_activity_connection
  - Type: integer
  - Description: Connection ID of the recommended connection in from_activity array.

#### Journey Object

Each journey in `to_activity`, `from_activity` (from `/connections`), or `connections` (from `/journey`) contains the following fields:

- Field: connection_id
  - Type: integer
  - Description: Unique identifier for this connection within the list.
- Field: connection_start_timestamp
  - Type: string
  - Description: The start time of the journey in ISO 8601 format (UTC).
- Field: connection_end_timestamp
  - Type: string
  - Description: The end time of the journey in ISO 8601 format (UTC).
- Field: connection_transfers
  - Type: integer
  - Description: The number of transfers in the journey.
- Field: connection_elements
  - Type: array
  - Description: Array of Connection Element objects representing each step in the journey.
- Field: connection_anytime
  - Type: boolean
  - Description: Indicates if the leg is time-independent (e.g., a walk).
- Field: connection_ticketshop_provider
  - Type: string
  - Description: (Optional) Name of the primary ticketshop provider (e.g., "OEBB", "SBB", "TRAIVELLING"). This is the first available provider from connection_ticketshop_segments. null if no provider is available. For backward compatibility, always check segments first.
- Field: connection_ticketshop_segments
  - Type: array
  - Description: (Optional) Array of Ticketshop Segment objects defining which provider covers which leg ranges. Only present when a ticketshop provider is available. See Ticketshop Segment below.
- Field: connection_score
  - Type: float
  - Description: Calculated score indicating the suitability of the connection (higher is better).

#### Connection Element

A `Connection Element` represents a single step (e.g., train, bus, or transfer) in the journey. It contains the following:

- Field: provider
  - Type: string
  - Description: Defines if a realtime data provider was used for this leg
- Field: from_location
  - Type: string
  - Description: The departure location for this Connection Element.
- Field: to_location
  - Type: string
  - Description: The arrival location for this Connection Element.
- Field: departure_time
  - Type: string
  - Description: The scheduled departure time in ISO 8601 format (UTC).
- Field: arrival_time
  - Type: string
  - Description: The scheduled arrival time in ISO 8601 format (UTC).
- Field: type
  - Type: string
  - Description: The type of transport (e.g., JNY for journey, TRSF for transfer).
- Field: vehicle_name
  - Type: string
  - Description: Optional. The name of the vehicle (e.g., REX64).
- Field: vehicle_type
  - Type: integer
  - Description: Optional. The vehicle type returned as ID (see below for mapping).
- Field: n_intermediate_stops
  - Type: integer
  - Description: Optional. Number of stops between origin and destination
- Field: direction
  - Type: string
  - Description: Optional. End stop of this vehicle's trip (headsign/direction)
- Field: platform_orig
  - Type: string
  - Description: Optional. Platform where this vehicle is departing from at origin
- Field: platform_dest
  - Type: string
  - Description: Optional. Platform where this vehicle will be arriving at the destination
- Field: alerts
  - Type: array
  - Description: Optional. Array of service alerts for this leg (see Alert Object below)

##### Vehicle Type Table

All Vehicle Types are returned as a ID. Each ID corresponds to a specific vehicle type. The following table provides the mapping:

| ID  | de              | en            | sl              | it          | fr          |
| --- | --------------- | ------------- | --------------- | ----------- | ----------- |
| 1   | Zug             | Train         | Vlak            | Treno       | Train       |
| 2   | Bus             | Bus           | Avtobus         | Bus         | Bus         |
| 3   | Straßenbahn     | Tram          | Tramvaj         | Tram        | Tramway     |
| 4   | U-Bahn          | Subway        | Metro           | Metro       | Métro       |
| 5   | Einschienenbahn | Monorail      | Monorail        | Monorotaia  | Monorail    |
| 6   | Zahnradbahn     | Cog Train     | Zobna železnica | Cremagliera | Crémaillère |
| 7   | Standseilbahn   | Funicular     | Funicular       | Funicolare  | Funiculaire |
| 8   | Seilbahn        | Aerial Lift   | Žičnica         | Funivia     | Téléporté   |
| 9   | Fähre           | Ferry         | Trajekt         | Traghetto   | Ferry       |
| 10  | Taxi            | Taxi          | Taksi           | Taxi        | Taxi        |
| 20  | Verschiedenes   | Miscellaneous | Raznovrsten     | Misto       | Différents  |
| 30  | Haus            | House         | Hiša            | Casa        | Maison      |
| 31  | Straße          | Street        | Ulica           | Strada      | Rue         |
| 32  | Platz           | Square        | Trg             | Piazza      | Place       |
| 33  | Park            | Park          | Park            | Parco       | Parc        |

##### Alert Object

Service alerts provide information about disruptions, delays, or other important notices for a leg. Alerts are based on the GTFS Realtime specification. Not every leg has alerts; they are only present when there is relevant service information.

- Field: cause
  - Type: string
  - Description: The cause of the alert. Possible values include: UNKNOWN_CAUSE, OTHER_CAUSE, TECHNICAL_PROBLEM, STRIKE, DEMONSTRATION, ACCIDENT, HOLIDAY, WEATHER, MAINTENANCE, CONSTRUCTION, POLICE_ACTIVITY, MEDICAL_EMERGENCY.
- Field: effect
  - Type: string
  - Description: The effect of the alert. Possible values include: NO_SERVICE, REDUCED_SERVICE, SIGNIFICANT_DELAYS, DETOUR, ADDITIONAL_SERVICE, MODIFIED_SERVICE, OTHER_EFFECT, UNKNOWN_EFFECT, STOP_MOVED, NO_EFFECT, ACCESSIBILITY_ISSUE.
- Field: header_text
  - Type: string
  - Description: Brief header/title text for the alert. May be empty if no header is provided.
- Field: description_text
  - Type: string
  - Description: Detailed description of the alert with additional information (e.g., booking URLs, instructions).

**Example Alert:**

```
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

- Segment 1: Legs 0-2 (trains) → covered by TRAIVELLING
- Segment 2: Leg 3 (bus) → `provider: null` (not covered)
- Segment 3: Legs 4-5 (trains) → covered by TRAIVELLING

The client application must handle this by:

1.  Showing which legs are covered by which provider
2.  Informing users when certain legs (e.g., buses) have no ticket booking available
3.  Calling `/generate-ticketshop-link` with the appropriate `segment_index` to get separate ticket links

- Field: leg_from
  - Type: integer
  - Description: Inclusive start index of the leg range in connection_elements (0-based).
- Field: leg_to
  - Type: integer
  - Description: Inclusive end index of the leg range in connection_elements (0-based).
- Field: provider
  - Type: string
  - Description: Name of the ticketshop provider for this segment (e.g., "TRAIVELLING", "OEBB"). null if no provider covers these legs.

**Example with Multiple Segments (Traivelling, Train + Bus + Train):**

```
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

```
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

```
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

| Field       | Type    | Description                                                          |
| ----------- | ------- | -------------------------------------------------------------------- |
| name        | string  | Display name of the location                                         |
| street      | string  | Street name (when applicable)                                        |
| city        | string  | City name                                                            |
| district    | string  | District/neighborhood                                                |
| postcode    | string  | Postal code                                                          |
| country     | string  | Country name                                                         |
| countrycode | string  | 2-letter country code                                                |
| type        | string  | Location type (house, street, locality, etc.)                        |
| osm_id      | integer | OpenStreetMap ID                                                     |
| osm_type    | string  | OSM element type (N=node, W=way, R=relation)                         |
| osm_key     | string  | OSM primary tag key                                                  |
| osm_value   | string  | OSM primary tag value                                                |
| extent      | array   | [Optional] Bounding box coordinates [minlon, minlat, maxlon, maxlat] |

#### Enhanced Properties (`diana_properties` object)

| Field         | Type    | Description                                                      |
| ------------- | ------- | ---------------------------------------------------------------- |
| original_name | string  | Preserves the original OSM name                                  |
| display_name  | string  | Optimized display format (e.g., "Stephansplatz 1, Vienna")       |
| short_display | string  | Compact version of display_name (currently identical)            |
| location_type | string  | Either "address" or "station"                                    |
| type_hint     | integer | ID representing the location type (see Vehicle Type Table below) |

#### Display Name Logic

- **Addresses**: `[street] [housenumber], [city]` (e.g., "Stephansplatz 1, Vienna") Falls back to original name if no street available
- **Stations**: Appends "(Station)" if name lacks station keywords (e.g., "U-Bahn", "Bahnhof") Format: `[name] (Station), [city]`

#### Type Hint IDs (Vehicle Type Table)

Matches the same IDs used in Connections API (see above):

| ID  | Description   | Examples                   |
| --- | ------------- | -------------------------- |
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

The response is the same as the Address Autocomplete response. Only one feature is returned, representing the reverse geocoded location. See [Address Autocomplete Response](#address-autocomplete-response) for details.

---

### Quota Check Response

The response is a JSON object containing the customer's quota and plan status.

| Field               | Type    | Description                                                   |
| ------------------- | ------- | ------------------------------------------------------------- |
| requests_this_month | integer | Number of requests made by the customer in the current month. |
| monthly_quota       | integer | Total monthly quota allocated to the customer.                |
| current_plans       | object  | Dictionary of active plans/scopes and their descriptions.     |

**Example:**

```
{
  "requests_this_month": 50,
  "monthly_quota": 100,
  "current_plans": {
    "starter_plan": "Starter-Plan: Free access to the Diana API",
    "realtime_at": "Access to realtime data in Austria"
  }
}

```

---

### Generate Ticketshop Link Response

On success, the response is a JSON object containing one or more generated deeplinks.

#### Response Fields

- Field: ticketshop_url
  - Type: string
  - Description: (Backward Compatible) The primary ticket shop URL. This is the first valid URL from ticketshop_links. Use this if you only need a single link and don't care about multi-segment scenarios.
- Field: ticketshop_links
  - Type: array
  - Description: Array of Ticketshop Link objects, one per segment. Each object contains the leg_from, leg_to, provider, and url for a ticket segment. This is the recommended field for handling multi-segment journeys.

#### Ticketshop Link Object

- Field: leg_from
  - Type: integer
  - Description: Inclusive start index of the leg range in connection_elements (0-based).
- Field: leg_to
  - Type: integer
  - Description: Inclusive end index of the leg range in connection_elements (0-based).
- Field: provider
  - Type: string
  - Description: Name of the ticketshop provider (e.g., "TRAIVELLING", "OEBB"). null if these legs have no ticket coverage.
- Field: url
  - Type: string
  - Description: The fully formed URL to the ticket shop for this segment. null if no provider covers these legs.

#### Response Behavior

- **Without `segment_index`** (default): Returns links for **all segments** with a provider. Segments without a provider (`provider: null`) are included with `url: null` to indicate which legs are not covered.
- **With `segment_index`**: Returns a link **only** for the specified segment. If that segment has no provider, an error is returned.

#### Example 1: Single Provider (OEBB)

All legs are covered by a single provider.

**Request:**

```
POST /generate-ticketshop-link
{
  "connection_elements": [ /* OEBB connection */ ]
}

```

**Response:**

```
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

```
POST /generate-ticketshop-link
{
  "connection_elements": [ /* Traivelling connection with bus leg */ ]
}

```

**Response:**

```
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

```
POST /generate-ticketshop-link
{
  "connection_elements": [
    { "type": "JNY", "vehicle_type": 1, ... },  // Leg 0: Train (Vienna → Linz)
    { "type": "TRSF", ... },                     // Leg 1: Transfer (5 min walk)
    { "type": "JNY", "vehicle_type": 1, ... }   // Leg 2: Train (Linz → Salzburg)
  ]
}

```

**Response:**

```
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

- Legs 0-2 (Train → Transfer → Train): Book as **ONE** ticket via Traivelling. The transfer does not break the segment.

#### Example 4: Requesting a Specific Segment

To get a link for only the second train segment (legs 5-6):

**Request:**

```
POST /generate-ticketshop-link
{
  "connection_elements": [ /* Same as Example 2 */ ],
  "segment_index": 2
}

```

**Response:**

```
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

The response is a JSON object containing the unique ID for the created share link.

| Field   | Type   | Description                                 |
| ------- | ------ | ------------------------------------------- |
| shareId | string | The unique hash key for the shared journey. |

**Example:**

```
{
  "shareId": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}

```

---

### Retrieve Shared Journey Response

The response is a JSON object containing the originally saved journey data. The structure matches the request body of the [Share Journey](#share-journey) endpoint.

**Example:**

```
{
    "origin": "Stephansplatz, Vienna",
    "origin_lat": 48.2084,
    "origin_lon": 16.3731,
    "date": "2024-09-15",
    "dateEnd": null,
    "to_connection_start_time": "2024-09-15T08:30:00Z",
    "to_connection_end_time": "2024-09-15T09:15:00Z",
    "from_connection_start_time": "2024-09-15T17:00:00Z",
    "from_connection_end_time": "2024-09-15T17:45:00Z",
    "shareURLPrefix": "https://example.com/planner"
}

```

---

## Errors and Codes

Errors are generally returned with a relevant HTTP status code (e.g., 400, 401, 404, 429, 500).

### Standard Error Response Format

For errors identified by the application (typically 4xx status codes), the response body follows this JSON format:

```
{
  "error": "[ERROR_MESSAGE]",
  "code": "[ERROR_CODE]"
}

```

### Error Code Table

- Code: 1001
  - Text: Query parameter 'q' is missing
  - Log Error into Table: No
- Code: 1002
  - Text: Invalid limit parameter
  - Log Error into Table: No
- Code: 1003
  - Text: Failed to fetch autocomplete results.
  - Log Error into Table: Yes
- Code: 2001
  - Text: Invalid coordinates format for user_start_location. Please use 'lat,lon'
  - Log Error into Table: No
- Code: 2002
  - Text: Could not geocode user_start_location '[USER_START_LOCATION]'
  - Log Error into Table: No
- Code: 2003
  - Text: Failed to geocode user_start_location.
  - Log Error into Table: Yes
- Code: 2004
  - Text: Unsupported user_start_location_type: '[USER_START_LOCATION_TYPE]'
  - Log Error into Table: No
- Code: 2005
  - Text: Invalid coordinates format for activity_start_location. Please use 'lat,lon'
  - Log Error into Table: No
- Code: 2006
  - Text: Could not geocode activity_start_location '[ACTIVITY_START_LOCATION]'
  - Log Error into Table: No
- Code: 2007
  - Text: Failed to geocode activity_start_location.
  - Log Error into Table: Yes
- Code: 2008
  - Text: Unsupported activity_start_location_type: '[ACTIVITY_START_LOCATION_TYPE]'
  - Log Error into Table: No
- Code: 2009
  - Text: Invalid coordinates format for activity_end_location. Please use 'lat,lon'
  - Log Error into Table: No
- Code: 2010
  - Text: Could not geocode activity_end_location '[ACTIVITY_END_LOCATION]'
  - Log Error into Table: No
- Code: 2011
  - Text: Failed to geocode activity_end_location.
  - Log Error into Table: Yes
- Code: 2012
  - Text: Unsupported activity_end_location_type: '[ACTIVITY_END_LOCATION_TYPE]'
  - Log Error into Table: No
- Code: 2017-1
  - Text: No suitable connections found TO the activity
  - Log Error into Table: No
- Code: 2017-2
  - Text: No suitable connections found FROM the activity
  - Log Error into Table: No
- Code: 2017-2F
  - Text: No suitable connections found FROM the activity today, even after fallback.
  - Log Error into Table: No
- Code: 2017-2F-1
  - Text: No suitable connections found FROM the activity, even after fallback.
  - Log Error into Table: No
- Code: 2018-1
  - Text: Connections found TO activity, but none met scoring criteria.
  - Log Error into Table: No
- Code: 2018-2
  - Text: Connections found FROM activity, but none met scoring criteria.
  - Log Error into Table: No
- Code: 2019-1
  - Text: No suitable connections found TO the activity (No connections found for TA segment; Merging might fail)
  - Log Error into Table: No
- Code: 2019-2
  - Text: No suitable connections found FROM the activity (No connections found for TA segment; Merging might fail)
  - Log Error into Table: No
- Code: 2020-1
  - Text: No suitable connections found TO the activity (No TA connections found or merging failed)
  - Log Error into Table: No
- Code: 2020-2
  - Text: No suitable connections found FROM the activity (No TA connections found or merging failed)
  - Log Error into Table: No
- Code: 2021-1
  - Text: No suitable connections found TO the activity within the specified time window.
  - Log Error into Table: No
- Code: 2021-2
  - Text: No suitable connections found FROM the activity within the specified time window.
  - Log Error into Table: No
- Code: 2022-1
  - Text: No suitable connections found TO the activity departing after current time.
  - Log Error into Table: No
- Code: 2023-1
  - Text: No suitable connections found TO the activity. (All filtered out by duration)
  - Log Error into Table: No
- Code: 2023-2
  - Text: No suitable connections found FROM the activity. (All filtered out by duration)
  - Log Error into Table: No
- Code: 2024
  - Text: Found return connections, but no incoming connection arrives early enough to make the latest return. Try adjusting activity duration or times.
  - Log Error into Table: No
- Code: 2025-1
  - Text: Error calculating connections to activity.
  - Log Error into Table: Yes
- Code: 2025-2
  - Text: Error calculating connections from activity.
  - Log Error into Table: Yes
- Code: 2026-1
  - Text: Internal error finding recommended 'to activity' connection.
  - Log Error into Table: Yes
- Code: 2027
  - Text: No suitable public transport stations could be found near the specified address.
  - Log Error into Table: No
- Code: 3001
  - Text: Internal error calculating connections to activity. (Error while fetching connections from provider)
  - Log Error into Table: Yes
- Code: 3002
  - Text: Internal error calculating connections from activity. (Error while fetching connections from provider)
  - Log Error into Table: Yes
- Code: 3003
  - Text: Internal error calculating connections from activity. (Error while fetching connections from provider, but inside fallback)
  - Log Error into Table: Yes
- Code: 3004
  - Text: Internal error processing fallback results.
  - Log Error into Table: Yes
- Code: 4001
  - Text: Latitude and longitude parameters are required
  - Log Error into Table: No
- Code: 4002
  - Text: Failed to fetch reverse geocode results.
  - Log Error into Table: Yes
- Code: 5001
  - Text: This shared link is invalid or has expired.
  - Log Error into Table: No
- Code: 5002
  - Text: An unexpected error occurred while retrieving the shared journey.
  - Log Error into Table: Yes
- Code: 6001
  - Text: Monthly quota exceeded
  - Log Error into Table: No
- Code: 7001
  - Text: connection_elements cannot be empty.
  - Log Error into Table: No
- Code: 7002
  - Text: Missing coordinates in connection elements.
  - Log Error into Table: No
- Code: 7003
  - Text: No ticketshop provider available for this connection.
  - Log Error into Table: No
- Code: 7004
  - Text: Could not extract necessary details from connection elements.
  - Log Error into Table: No
- Code: 7005
  - Text: Failed to generate ticketshop URL.
  - Log Error into Table: Yes
- Code: 7006
  - Text: An unexpected error occurred during link generation.
  - Log Error into Table: Yes
- Code: 7007
  - Text: segment_index [INDEX] is out of range (0-[MAX]).
  - Log Error into Table: No
- Code: 7008
  - Text: The requested segment has no ticketshop provider.
  - Log Error into Table: No
- Code: 8001
  - Text: Invalid coordinates format for from_location. Please use 'lat,lon'
  - Log Error into Table: No
- Code: 8002
  - Text: Could not geocode from_location '[FROM_LOCATION]'
  - Log Error into Table: No
- Code: 8003
  - Text: Failed to geocode from_location.
  - Log Error into Table: Yes
- Code: 8004
  - Text: Unsupported from_location_type: '[FROM_LOCATION_TYPE]'
  - Log Error into Table: No
- Code: 8005
  - Text: Invalid coordinates format for to_location. Please use 'lat,lon'
  - Log Error into Table: No
- Code: 8006
  - Text: Could not geocode to_location '[TO_LOCATION]'
  - Log Error into Table: No
- Code: 8007
  - Text: Failed to geocode to_location.
  - Log Error into Table: Yes
- Code: 8008
  - Text: Unsupported to_location_type: '[TO_LOCATION_TYPE]'
  - Log Error into Table: No
- Code: 8010
  - Text: Internal error calculating connections.
  - Log Error into Table: Yes
- Code: 8011
  - Text: No connections found for the specified route and time.
  - Log Error into Table: No
- Code: 8012
  - Text: No connections found departing in the future.
  - Log Error into Table: No

---

## Example Usage

### Connections Example

```
GET /connections?user_start_location=Karlsplatz, Wien&activity_name=Hiking Rax&activity_start_location=47.715575,15.804045&activity_start_location_type=coordinates&activity_end_location=47.682191,15.644807&activity_end_location_type=coordinates&activity_earliest_start_time=08:00&activity_latest_start_time=10:00&activity_earliest_end_time=16:00&activity_latest_end_time=18:00&activity_duration_minutes=210
Authorization: Bearer [token]

```

### Journey Example

```
GET /journey?from_location=Stephansplatz, Wien&to_location=Wien Hauptbahnhof&date=2025-11-20&time=14:30:00&is_arrival=false
Authorization: Bearer [token]

```

### Address Autocomplete Example

```
GET /address-autocomplete?q=Wien%20Step&hint_lat=48.208&hint_lon=16.373
Authorization: Bearer [token]

```

### Generate Ticketshop Link Example

```
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

```
POST /share
Authorization: Bearer [token]
Content-Type: application/json

{
    "origin": "Stephansplatz, Vienna",
    "date": "2024-09-15",
    "to_connection_start_time": "2024-09-15T08:30:00Z",
    "to_connection_end_time": "2024-09-15T09:15:00Z"
}

```

### Retrieve Shared Journey Example

```
GET /share/a1b2c3d4-e5f6-7890-1234-567890abcdef
Authorization: Bearer [token]

```

For complete examples, see the Postman collection at [Diana API Postman Collection](./Diana%20API.postman_collection.json).

---

## Troubleshooting & Edge Cases

1.  **Invalid Coordinates**:
    - Returns `400` error with message: `Invalid coordinates format for [location]. Please use lat,lon` (Code: 2001, 2005, 2009, 8001, 8005)

2.  **No Connections Found**:
    - Returns `404` error with relevant message (Codes: 2017, 2018, 2019, 2022, 2023, 8011, 8012)
    - Maybe due to:
      - No connections fitting the time windows (EST-LST, EET-LET).
      - Calculated duration preventing a valid return journey even with fallback logic.
      - Check activity times, duration, and date.

3.  **Authentication Errors**:
    - Returns `401 Unauthorized` for missing, invalid, or expired authentication tokens.
    - Ensure the `Authorization` header includes a valid `Bearer [token]`.

4.  **Monthly Quota Exceeded**:
    - Returns `429 Too Many Requests` with error code `6001`.
    - This applies to free-tier users on the `/connections` and `/journey` endpoints.

5.  **Location Not Found / Geocoding Failed**:
    - Returns `400` error if a provided location name cannot be geocoded (Codes: 2002, 2006, 2010, 8002, 8006).
    - Returns `500` error if the geocoding service itself fails (Codes: 2003, 2007, 2011, 8003, 8007).

6.  **Shared Link Invalid or Expired**:
    - Returns `404` error with message: `This shared link is invalid or has expired.` (Code: 5001)

7.  **Incomplete Data in Response**:
    - Missing optional fields in the response (e.g., `vehicle_name`) might be returned as `null` or omitted.
    - Client applications should handle null/missing values gracefully (e.g., display "N/A").

8.  **Date Handling**:
    - If `date` is not provided for a connection search, the current date (UTC) is used.
    - Date must be in `YYYY-MM-DD` format.
    - All times sent and received are UTC. Client applications are responsible for converting to/from local timezones for display.
