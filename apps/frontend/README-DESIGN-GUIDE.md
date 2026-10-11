# Zuugle Frontend — Design Guide & UI Specification

This document is the authoritative design guide for the **Zuugle Frontend** (`apps/frontend`). It translates the [Bahn zum Berg Corporate Design Manual](Corporate_Design.md) and established codebase conventions into clear, actionable rules for components, typography, colors, responsive layouts, and interactive states.

---

## 1. Core Principles

1. **Brand Identity & Atmosphere**:
   - **Nature meets Public Transit**: Colors reflect alpine meadows, blue skies, and railway signage.
   - **Approachable & Inspiring**: Welcoming, relaxed, community-driven ("per Du", cheerful, clear).
2. **Mobile-First Priority**:
   - Most users discover and search tours on smartphones while in transit or outdoors. Every feature, button, and layout must be designed and verified on mobile (`< 600px`) first.
3. **Strict Consistency**:
   - Do not invent arbitrary colors, font sizes, or border radii. Reuse existing design tokens (`src/theme.tsx` and CSS custom properties in `src/App.css`).
4. **Accessibility (WCAG AA)**:
   - All interactive elements and text pairings must meet WCAG AA contrast requirements (minimum 4.5:1 for normal text, 3:1 for large text / UI components).

---

## 2. Color System

### 2.1 Corporate Design Palette

The primary palette mirrors the `--bzb-*` CSS custom properties in [`src/App.css`](src/App.css) and the MUI theme in [`src/theme.tsx`](src/theme.tsx):

| Color Name          | CSS Variable             | Hex Code  | RGB             | Role & Usage in UI                                                                                                                                                        |
| :------------------ | :----------------------- | :-------- | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Bahnblau**        | `--bzb-bahnblau`         | `#254980` | `37, 73, 128`   | **Primary Brand Color.** Search headers, primary links, dark text on active/green badges, button hover state, railway signposts.                                          |
| **Akelei**          | `--bzb-akelei`           | `#712579` | `113, 38, 122`  | **Secondary Brand & Action Color.** Default fill for primary call-to-action buttons (`MuiButton-containedPrimary`), hero accents, section titles.                         |
| **Lindgrün**        | `--bzb-lindgruen`        | `#ccd8a1` | `204, 216, 161` | **Active / Success State.** Background for active filter buttons, active favorites toggle, filter chips, success notifications. Pair with Bahnblau text (5.9:1 contrast). |
| **Wolkenblau**      | `--bzb-wolkenblau`       | `#aab5d7` | `170, 181, 215` | **Soft Info Tone.** Subtle map borders, secondary icons, informational markers.                                                                                           |
| **Wolkenblau Hell** | `--bzb-wolkenblau-light` | `#f0f4ff` | `240, 244, 255` | **Light Info Surface.** Background for info boxes and tooltips. Carries Bahnblau text at 8.1:1 contrast.                                                                  |
| **Veilchenlila**    | `--bzb-veilchenlila`     | `#bcb8dc` | `188, 184, 220` | **Atmospheric Purple.** Subtle decorative accents and category differentiation.                                                                                           |

### 2.2 Digital UI Supplement (Alerts & System Feedback)

The print CD manual lacks dedicated red/yellow feedback tones. The digital web application defines the following standard feedback colors:

| Color Name            | CSS Variable             | Hex Code  | Usage                                                                                                                                          |
| :-------------------- | :----------------------- | :-------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Warnorange**        | `--bzb-warnorange`       | `#e65100` | **Accent Only.** Icons and left accent borders for warnings/errors. _Never use pure white text on this color (3.8:1 fails WCAG AA)._           |
| **Warnorange Dunkel** | `--bzb-warnorange-dark`  | `#bf360c` | **Accessible Text & Outline.** High-contrast text on light warning backgrounds (5.1:1+) and text/outline color for destructive action buttons. |
| **Warnorange Hell**   | `--bzb-warnorange-light` | `#fff3e0` | **Warning Surface.** Background fill for error banners, warning dialogs, and validation alerts.                                                |

### 2.3 Neutral Tones & Surfaces

| Color Name         | Hex / Value           | Usage                                                                    |
| :----------------- | :-------------------- | :----------------------------------------------------------------------- |
| **Pure White**     | `#ffffff`             | Page background, cards, text on Bahnblau/Akelei surfaces.                |
| **Light Gray 1**   | `#f5f5f5`             | Page background in search/detail view, secondary card backgrounds.       |
| **Light Gray 2**   | `#eaeaea` / `#ececec` | Dividers, card borders, section separators.                              |
| **Border Gray**    | `#dddddd`             | Input borders, timeline lines, horizontal separator rules.               |
| **Medium Gray**    | `#8b8b8b`             | Subtitles (`subtitle2`), reset buttons, secondary labels, metadata text. |
| **Dark Body Text** | `#101010`             | Primary headings, readable body text, high-contrast labels.              |
| **Overlay Black**  | `rgba(0, 0, 0, 0.5)`  | Modal backdrops, translucent image gradients.                            |

---

## 3. Typography & Line Heights

### 3.1 Typefaces

1. **Source Sans 3** (Primary UI Font):
   - Stored locally as WOFF2 for GDPR compliance (no Google Fonts network requests).
   - Weights: `300` (Light), `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold), `900` (Black).
   - Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
2. **Juniper Bay** (Accent & Handwriting Font):
   - Organic, handwritten script font for highlights, personal quotes, and special badges.
   - Used for the **"Top Tour"** badge on tour cards:
     ```tsx
     <Typography
       sx={{ fontFamily: '"Juniper Bay"', fontSize: "20px", lineHeight: 1 }}
     >
       {t("main.top_tour")}
     </Typography>
     ```
   - _Constraint:_ Do not use Juniper Bay for functional UI text, buttons, body copy, or table data.

### 3.2 Line Heights (Zeilenabstände)

- **Display Headings (`H1`)**: `0.9` to `1.1` (tight and impactful).
- **Section Headings (`H2` – `H4`)**: `1.1` to `1.25`.
- **Body Text (`text`, `body1`, `body2`)**: `1.3` to `1.5` (e.g. `fontSize: 16px, lineHeight: 22px` = `1.375`).
- **Metadata / Key-Value Pairs (`infoKey`)**: `1.5` (e.g. `fontSize: 15px, lineHeight: 23px` on desktop, `12px / 18px` on mobile).
- **Badges, Chips & Single-Line Labels**: `1.0` (prevents vertical misalignment).

### 3.3 Typography Scale (MUI Theme Variants)

| Variant               | Desktop Size / Weight | Mobile Size (< 600px) | Color                 | Line Height     | Usage                                                            |
| :-------------------- | :-------------------- | :-------------------- | :-------------------- | :-------------- | :--------------------------------------------------------------- |
| `h1`                  | 54px / SemiBold (600) | 36px                  | `#ffffff`             | 1.1             | Hero headline on start page.                                     |
| `title`               | 32px / Bold (700)     | 26px                  | `#712579` (Akelei)    | 1.15            | Page titles, major category headers.                             |
| `h3`                  | 32px / Bold (700)     | 18px                  | `#ffffff` / `#101010` | 1.2             | Section titles.                                                  |
| `h4`                  | 22px / SemiBold (600) | 18px                  | `#101010`             | 1.25            | Sub-section headers, tour detail titles.                         |
| `h5alt`               | 18px / SemiBold (600) | 16px                  | `#101010`             | 1.3             | Card headers, dialog section titles.                             |
| `h5`                  | 14px / Bold (700)     | 14px                  | `#254980` (Bahnblau)  | 1.2             | Uppercase category markers (e.g., `textTransform: "uppercase"`). |
| `subtitle1`           | 16px / SemiBold (600) | 15px                  | `#101010`             | 1.3             | Filter group titles, bold labels.                                |
| `subtitle2`           | 16px / SemiBold (600) | 14px                  | `#8b8b8b`             | 1.3             | Secondary subtitles, timestamps.                                 |
| `subtitle3`           | 16px / Regular (400)  | 14px                  | `#101010`             | 1.4             | Form descriptions, modal explanations.                           |
| `text` / `body1`      | 16px / Regular (400)  | 15px                  | `#8b8b8b` / `#101010` | 22px (~1.38)    | General body copy and tour descriptions.                         |
| `textSmall` / `body2` | 14px / Regular (400)  | 13px                  | `#8b8b8b`             | 22px (~1.57)    | Secondary descriptions, disclaimer text.                         |
| `cardTitle`           | 14px / Bold (700)     | 14px                  | `#000000`             | 18px (~1.28)    | Titles on tour cards.                                            |
| `infoKey`             | 15px / Regular (400)  | 12px                  | `#101010`             | 23px (18px mob) | Transit details, tour length properties.                         |
| `link`                | 16px / Medium (500)   | 15px                  | `#254980` (Bahnblau)  | 22px            | Text links with hover underline.                                 |
| `caption` (`grayP`)   | 12px / Medium (500)   | 11px                  | `rgba(0,0,0,0.5)`     | 1.3             | Micro-copy, badge captions.                                      |

---

## 4. Breakpoints & Mobile-First Prioritization

### 4.1 Responsive Breakpoints

The project relies on standard Material-UI breakpoints:

```ts
xs: 0px      // Mobile portrait (< 600px)
sm: 600px    // Mobile landscape / tablets portrait (600px - 899px)
md: 900px    // Tablets landscape / small desktops (900px - 1024px)
lg: 1025px   // Desktop view (1025px - 1399px)
xl: 1400px   // Wide screens (>= 1400px)
```

### 4.2 Container Widths & Margins

| Container           | Max Width | Horizontal Padding (Mobile) | Horizontal Padding (Desktop) | Usage                                                    |
| :------------------ | :-------- | :-------------------------- | :--------------------------- | :------------------------------------------------------- |
| `.cards-container`  | `1400px`  | `15px`                      | `30px`                       | Main grid of tour cards. Centered with `margin: 0 auto`. |
| `.rowing`           | `1400px`  | `15px`                      | `30px`                       | Header navigation bar and search bar container.          |
| `.static-container` | `1000px`  | `15px`                      | `30px`                       | Static legal pages (Privacy, Imprint).                   |
| `.map-fullscreen`   | `100%`    | `0px` (Edge-to-Edge)        | `30px` (Aligned with cards)  | Interactive Leaflet map container.                       |

### 4.3 Mobile-First Rules

1. **Touch Targets**:
   - Any clickable icon or button must have a minimum touch area of **`40px × 40px`** (preferably `44px × 44px`).
2. **Adaptive Button Shapes**:
   - Buttons in the top search bar (Filter, Favorites) show **Icon + Label** on desktop (`sm` and above), but automatically collapse into **40px × 40px IconButtons** on `xs` (`< 600px`).
3. **Sticky & Floating Controls**:
   - The map view toggle button (`MapBtn`) floats fixed at the bottom center:
     ```css
     position: fixed;
     left: 50%;
     transform: translateX(-50%);
     bottom: 8px;
     border-radius: 50px;
     ```
   - On mobile, it displays as an icon button; on desktop, it displays icon + text.
4. **Horizontal Carousels**:
   - On mobile, scroll navigation arrows are hidden (`display: none`), allowing users to swipe natively with touch gestures.
5. **Full-Bleed Map**:
   - On viewports `< 600px`, the map stretches edge-to-edge (`padding: 0 !important`) to maximize usable screen real estate.

---

## 5. Interactive Component States

### 5.1 Buttons

#### Contained Primary Button (Main Action)

- **Normal State**:
  - Background: `var(--bzb-akelei)` (`#712579`)
  - Text: `#ffffff`
  - Border Radius: `12px` (standard) or `50px` (pill/floating)
  - Typography: `14px`, `fontWeight: 600`, `textTransform: "none"`
- **Hover State**:
  - Background: `var(--bzb-bahnblau)` (`#254980`)
  - Transition: `background-color 0.2s ease`
- **Active / Pressed**:
  - Background: `#5a1d61` or slight scale down (`transform: scale(0.98)`).

```tsx
<Button
  variant="contained"
  color="primary"
  sx={{
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 600,
    bgcolor: "var(--bzb-akelei)",
    "&:hover": { bgcolor: "var(--bzb-bahnblau)" },
  }}
>
  Suchen
</Button>
```

#### Toggle Buttons (Active vs. Inactive State)

Used for the **Filter Button**, **Favorites Toggle**, and toggleable filters:

| State                      | Background                         | Text / Icon Color                 | Border                  | Shadow / Hover                                                                  |
| :------------------------- | :--------------------------------- | :-------------------------------- | :---------------------- | :------------------------------------------------------------------------------ |
| **Active**                 | `var(--bzb-lindgruen)` (`#ccd8a1`) | `var(--bzb-bahnblau)` (`#254980`) | `transparent`           | `boxShadow: "0 1px 4px rgba(37,73,128,0.25)"`, Hover: `darken("#ccd8a1", 0.08)` |
| **Inactive (on blue bar)** | `rgba(255, 255, 255, 0.15)`        | `#ffffff`                         | `transparent`           | Hover: `rgba(255, 255, 255, 0.28)`                                              |
| **Inactive (on white bg)** | `lighten(#712579, 0.9)`            | `var(--bzb-akelei)`               | `lighten(#712579, 0.3)` | Hover: `lighten(#712579, 0.84)`                                                 |

#### Secondary / Outlined Button

- **Normal**: `bgcolor: "transparent"`, border `1px solid var(--bzb-akelei)`, color `var(--bzb-akelei)`.
- **Hover**: `bgcolor: "rgba(113, 37, 121, 0.06)"`, border `var(--bzb-akelei)`.

#### Disabled State

- **Normal**:
  - Background: `#cccccc` (contained) or `transparent` (outlined/text).
  - Text & Icon: `#888888`.
  - Cursor: `not-allowed`.
  - Box Shadow: `none`.
- **MUI Implementation**:
  ```tsx
  "&.Mui-disabled": {
    bgcolor: "#ccc",
    color: "#888",
  }
  ```

#### Reset & Destructive Actions

- **Filter Reset / Cancel**: Use a `text` button with neutral color:
  ```tsx
  <Button
    variant="text"
    sx={{ color: "#8B8B8B", "&:hover": { color: "#101010" } }}
  >
    Filter löschen
  </Button>
  ```
- **Destructive Action** (e.g., clear favorites):
  - Use an **outlined** button with `Warnorange Dunkel` (`#bf360c`), **never** a filled solid red/orange block.

---

### 5.2 Filter Chips & Tags

- **Active Filter Chip**:
  - Background: `var(--bzb-lindgruen)` (`#ccd8a1`)
  - Text Color: `var(--bzb-bahnblau)` (`#254980`)
  - Delete Icon: `rgba(37, 73, 128, 0.6)`, on hover `var(--bzb-bahnblau)`
  - Border Radius: `16px` (Pill)
  - Typography: `13px`, `fontWeight: 500`
- **More Filters Chip** (`+X weitere Filter`):
  - Border Radius: `16px`
  - Hover: `bgcolor: "var(--bzb-bahnblau)", color: "#fff"`

---

### 5.3 Cards & Elevated Surfaces

- **Tour Card**:
  - Background: `#ffffff`
  - Border Radius: `24px` (Image inside has `border-radius: 25px`)
  - Box Shadow: default `0 2px 8px rgba(0, 0, 0, 0.08)`
  - Hover Effect:
    ```css
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    ```
- **Floating Modals & Drawers**:
  - Border Radius: `20px` to `24px`
  - Drop Shadow: `0px 2px 15px rgba(0, 0, 0, 0.15)`

---

## 6. Icons & Visual Symbols

### 6.1 Icon Libraries

1. **Material-UI Icons (`@mui/icons-material`)**:
   - The primary choice for general UI, navigation, and common actions.
   - **Style Guideline**: Always prefer **Rounded** or **Outlined** variants to match the organic mountain aesthetic:
     - Favorites: `FavoriteRoundedIcon` (active/saved), `FavoriteBorderRoundedIcon` (unsaved).
     - Navigation: `ArrowBackRoundedIcon`, `CloudSyncRoundedIcon`.
     - Controls: `TuneOutlinedIcon` (Filter), `MapOutlinedIcon` (Map), `InfoOutlinedIcon` (Tooltips).
2. **Transit & Domain Icons (`src/icons/icons.ts`)**:
   - Custom SVG vector icons for alpine and public transit semantics:
     - `TransportTrain`, `TransportBus`, `Tram`, `TransportWalk`, `Seilbahn`.
     - `Überschreitung` (traverse tour), `Anreise` / `Rückreise` (journey legs).
3. **Map & Waypoint Icons (`src/components/Search/icons/`)**:
   - `PeakIcon` (summit cross), `HutIcon` (mountain hut), `TermIcon` (search term).

### 6.2 Icon Sizing Standards

| Size Category        | Dimensions    | Context                                                     |
| :------------------- | :------------ | :---------------------------------------------------------- |
| **Small**            | `16px – 18px` | Inline with metadata, inside small chips, badge icons.      |
| **Medium / Default** | `20px – 22px` | Standard buttons, search input adornments, list item icons. |
| **Large**            | `24px – 28px` | Floating action triggers, dialog header icons.              |
| **Hero / Feature**   | `32px – 48px` | Domain switcher, empty state illustrations.                 |

---

## 7. Spacing, Elevation & Radius System

### 7.1 Spacing Grid (Multiples of 4px / 8px)

Always express padding, margins, and gaps using the 8px baseline scale:

| Token      | Size            | Typical Use Case                                               |
| :--------- | :-------------- | :------------------------------------------------------------- |
| `space-1`  | `4px`           | Micro-spacing, inline badge padding, KPI gap.                  |
| `space-2`  | `8px`           | Tight gaps between buttons, chip spacing, mobile card margins. |
| `space-3`  | `12px`          | Standard button vertical padding, form field spacing.          |
| `space-4`  | `16px`          | Card content padding, container inner spacing.                 |
| `space-5`  | `20px`          | Dialog action padding, search bar padding.                     |
| `space-6`  | `24px`          | Modal body padding, grid gutter spacing.                       |
| `space-8`  | `32px`          | Desktop card container margin, section separation.             |
| `space-12` | `48px` – `50px` | Header bottom padding, hero spacing.                           |

### 7.2 Border Radius Hierarchy

```
  50px  ── Fully rounded pills: Search input container, SearchBarButton, MapBtn, toggle pills
  24px  ── Major surfaces: Tour Card root, MuiCard, Dialog container
  20px  ── Floating dropdowns: DomainMenu, CountrySwitch
  16px  ── Chips, badges, Top Tour label
  12px  ── Interactive controls: Standard buttons, OutlinedInput, DatePicker
  10px  ── Compact notification boxes, Alert root
```

### 7.3 Elevation & Shadow Hierarchy

- **Level 1 (Subtle / Card Rest)**:
  `box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);`
- **Level 2 (Active Button / Floating Pill)**:
  `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);`
- **Level 3 (Dropdown Menu / Dialog)**:
  `box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);`
- **Level 4 (Card Hover Elevation)**:
  `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);`

---

## 8. Summary of Do's and Don'ts

| Do                                                                                  | Don't                                                                                  |
| :---------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| **Use `var(--bzb-akelei)` for primary buttons** and hover to `var(--bzb-bahnblau)`. | Do not use generic browser blue or MUI default primary blue.                           |
| **Use `Lindgrün` background with `Bahnblau` text** for active filters and toggles.  | Do not use solid green for generic buttons or white text on Lindgrün (fails contrast). |
| **Use `Warnorange Dunkel` (`#bf360c`) for text** on light warning surfaces.         | Do not use pure `Warnorange` (`#e65100`) as text or place white text on it.            |
| **Use `#ccc` background and `#888` text** for disabled buttons.                     | Do not leave disabled buttons looking clickable or faintly transparent.                |
| **Use `Source Sans 3`** for all UI copy and form elements.                          | Do not use Arial, Helvetica, or system defaults unless falling back.                   |
| **Restrict `Juniper Bay`** strictly to decorative badges, quotes, and highlights.   | Do not use Juniper Bay for body text, button labels, or tables.                        |
| **Ensure all buttons have at least `40px` tap area on mobile.**                     | Do not place small text links or tiny icons without tap padding on touch screens.      |
| **Design mobile layout `< 600px` first**, testing responsive collapse.              | Do not build desktop-only layouts that break or overflow on small viewports.           |
