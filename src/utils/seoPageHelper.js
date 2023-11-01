import * as React from "react";
import Box from "@mui/material/Box";
import { Grid, Typography } from "@mui/material";
// import {Helmet} from "react-helmet";
import { Helmet, HelmetProvider } from "react-helmet-async";

export const getPageHeader = (directLink) => {
  console.log("L8 directLink: ", JSON.stringify(directLink));
  
  if (!!directLink && !!directLink.header) {
    console.log("L11 directLink.header: ", JSON.stringify(directLink.header));
    return (
      <HelmetProvider>
        <Helmet>
          <title>{directLink.header}</title>
          <meta name="og:title" content={directLink.header} />
          <meta name="og:description" content={directLink.description} />
        </Helmet>
      </HelmetProvider>
    );
  } else {
    return (
      <HelmetProvider>
        <Helmet>
          {/* <title>start.helmet_title</title> */}
          <title>Zuugle</title>
          <meta
            name="title"
            content="Zuugle - die Suchmaschine für Öffi-Bergtouren"
          />
          <meta
            name="description"
            content="Zuugle zeigt dir geprüfte Verbindungen mit Bahn und Bus zu Bergtouren, Wanderungen, Skitouren, Schneeschuhwanderungen, etc. von deinem Wohnort aus an."
          />
        </Helmet>
      </HelmetProvider>
    );
  }
};

export const extractCityFromLocation = (location) => {
  if (!!location && !!location.search) {
    const searchParams = new URLSearchParams(location.search);
    const cityParam = searchParams.get("city");
    return cityParam;
  }
  return null; // Return null if the city parameter is not found in the search
};

export const getCityLabel = (location, cities) => {
  let citySlug = !!location ? extractCityFromLocation(location) : null;
  if(!!cities && cities.length > 0){
    const found = cities.find(
      (city) => city.value == citySlug
    );
    return found.label;
    }else{
      return "";
    }
}
// export const checkIfSeoPageCity = (location, cities) => {
//   let citySlug = extractCityFromLocation(location);
 
//   if (!!location && !!location.pathname && location.pathname == "/suche") {
//     return null;
//   } else if (!!location && !!location.pathname && cities.length > 0) {
//     const found = cities.find(
//       (city) => city.value == citySlug
//     );
//     return found;
//   } else {
//     return null;
//   }
// };

// export const checkIfSeoPageRange = (location, ranges) => {
//   if (!!location && !!location.pathname && location.pathname == "/suche") {
//     return null;
//   } else if (!!location && !!location.pathname && ranges.length > 0) {
//     const found = ranges.find(
//       (range) =>
//         range.range_slug == parseRangeFromUrl(location.pathname.substring(1))
//     );
//     return found;
//   } else {
//     return null;
//   }
// };

//description
//This function, listAllCityLinks, takes in an array of cities and an optional searchParams object. It then maps over the array of cities and generates links for each city with appropriate URL parameters. Finally, it returns a JSX element containing a grid of city links wrapped in a Box with a Typography element for the title. If the cities argument is falsy, it returns an empty array.
export const listAllCityLinks = (cities, searchParams = null) => {
  //   const { t } = useTranslation();

  const country = translatedCountry();

  if (!!cities) {
    const entries = cities.map((city, index) => {
      let link = `${city.value}`;
      if (!!searchParams && !!searchParams.get("p")) {
        link = `${link}?p=${searchParams.get("p")}`;
      }
      return (
        <Grid key={index} item xs={12} sm={6} md={4}>
          <a href={`/${link}`} className={"seo-city-link"}>
            {city.label}
          </a>
        </Grid>
      );
    });
    return (
      <Box sx={{ textAlign: "left" }}>
        <Typography variant={"h4"} sx={{ marginBottom: "20px" }}>
          {/* <>{country}</> */}
        </Typography>
        <Grid container>{entries}</Grid>
      </Box>
    );
  }
};

// export const listAllRangeLinks = (ranges, searchParams = null) => {
//   //   const { t } = useTranslation();
//   const country = translatedCountry();

//   if (!!ranges) {
//     const entries = ranges.map((range, index) => {
//       let city = "";
//       let link = `${range.range}`;
//       if (link == "null") {
//         return [];
//       }
//       link = parseRangeToUrl(link);
//       if (!!searchParams && !!searchParams.get("p")) {
//         link = `${link}?p=${searchParams.get("p")}`;
//       }
//       if (!!searchParams && !!searchParams.get("city")) {
//         city = searchParams.get("city");
//       }
//       return (
//         <Grid key={index} item xs={12} sm={6} md={4}>
//           <a
//             href={`/suche?range=${link}${!!city ? "&city=" + city : ""}`}
//             className={"seo-city-link"}
//           >
//             {range.range}
//           </a>
//         </Grid>
//       );
//     });

//     return (
//       <Box sx={{ textAlign: "left" }}>
//         <Typography variant={"h4"} sx={{ marginBottom: "20px" }}>
//           {/* <> country </> */}
//         </Typography>
//         <Grid container>{entries}</Grid>
//       </Box>
//     );
//   }
//   return [];
// };

const translatedCountry = () => {
  //   const { t } = useTranslation();
  const country = getCountryName();
  const countryKey = getCountryKey(country);

  return `start.${countryKey}`;
};

export const getCountryKey = (name) => {
  switch (name) {
    case "Schweiz":
      return "schweiz";
    case "Österreich":
      return "oesterreich";
    case "Deutschland":
      return "deutschland";
    case "Frankreich":
      return "frankreich";
    case "Slowenien":
      return "slowenien";
    case "Italien":
      return "italien";
    default:
      return "oesterreich";
  }
};

export const getCountryName = () => {
  let host = window.location.host;
  // let host = "www2.zuugle.fr";

  if (host.indexOf("zuugle.ch") >= 0) {
    return "Schweiz";
  } else if (host.indexOf("zuugle.de") >= 0) {
    return "Deutschland";
  } else if (host.indexOf("zuugle.it") >= 0) {
    return "Italien";
  } else if (host.indexOf("zuugle.fr") >= 0) {
    return "Frankreich";
  } else if (host.indexOf("zuugle.si") >= 0) {
    return "Slowenien";
  } else {
    return "Österreich";
  }
};

export const getTranslatedCountryName = () => {
  let host = window.location.host;

  if (host.indexOf("zuugle.ch") >= 0) {
    return "start.schweiz";
  } else if (host.indexOf("zuugle.de") >= 0) {
    return "start.deutschland";
  } else if (host.indexOf("zuugle.it") >= 0) {
    return "start.italien";
  } else if (host.indexOf("zuugle.fr") >= 0) {
    return "start.frankreich";
  } else if (host.indexOf("zuugle.si") >= 0) {
    return "start.slowenien";
  } else {
    return "start.oesterreich";
  }
};


const parseRangeFromUrl = (text) => {
  return decodeURI(text);
};

const parseRangeToUrl = (text) => {
  return encodeURI(text);
};
