import * as React from "react";
import Box from "@mui/material/Box";
import { Divider, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ChevronRightLight from "../../icons/ChevronRight";
import CircularProgress from "@mui/material/CircularProgress";

export function CityResultList({
  cities,
  setCity,
  setCityInput,
  onFocusCity,
  isCityLoading,
  loadRegions,
  loadFavouriteTours,
  setOpenCitySearch,
  searchParams,
  setSearchParams,
  showNotFoundEntry = true,
  onSelect,
}) {
  const [sliceCities, setSliceCities] = useState(true);

  const renderLinksBasedOnHost = () => {
    let host = location.hostname;
    if (host.indexOf("www.zuugle.at") >= 0) {
      return (
        <Fragment>
          {generateLinkEntry(
            "https://www.zuugle.de",
            "zuugle.de",
            "Bahnhöfe in Deutschland"
          )}
          {generateLinkEntry(
            "https://www.zuugle.ch",
            "zuugle.ch",
            "Bahnhöfe in der Schweiz"
          )}
          {generateLinkEntry(
            "https://www.zuugle.it",
            "zuugle.it",
            "Bahnhöfe in Italien"
          )}
          {generateLinkEntry(
            "https://www.zuugle.si",
            "zuugle.si",
            "Bahnhöfe in Slowenien"
          )}
          {generateLinkEntry(
            "https://www.zuugle.fr",
            "zuugle.fr",
            "Bahnhöfe in Frankreich"
          )}
        </Fragment>
      );
    } else if (host.indexOf("www.zuugle.de") >= 0) {
      return (
        <Fragment>
          {generateLinkEntry(
            "https://www.zuugle.at",
            "zuugle.at",
            "Bahnhöfe in Österreich"
          )}
          {generateLinkEntry(
            "https://www.zuugle.ch",
            "zuugle.ch",
            "Bahnhöfe in der Schweiz"
          )}
          {generateLinkEntry(
            "https://www.zuugle.it",
            "zuugle.it",
            "Bahnhöfe in Italien"
          )}
          {generateLinkEntry(
            "https://www.zuugle.fr",
            "zuugle.fr",
            "Bahnhöfe in Frankreich"
          )}
          {generateLinkEntry(
            "https://www.zuugle.si",
            "zuugle.si",
            "Bahnhöfe in Slowenien"
          )}
        </Fragment>
      );
    } else if (host.indexOf("www.zuugle.ch") >= 0) {
      return (
        <Fragment>
          {generateLinkEntry(
            "https://www.zuugle.at",
            "zuugle.at",
            "Bahnhöfe in Österreich"
          )}
          {generateLinkEntry(
            "https://www.zuugle.de",
            "zuugle.de",
            "Bahnhöfe in Deutschland"
          )}
          {generateLinkEntry(
            "https://www.zuugle.it",
            "zuugle.it",
            "Bahnhöfe in Italien"
          )}
          {generateLinkEntry(
            "https://www.zuugle.it",
            "zuugle.fr",
            "Bahnhöfe in Frankreich"
          )}
          {generateLinkEntry(
            "https://www.zuugle.it",
            "zuugle.si",
            "Bahnhöfe in Slowenien"
          )}
        </Fragment>
      );
    } else if (host.indexOf("www.zuugle.it") >= 0) {
      return (
        <Fragment>
          {generateLinkEntry(
            "https://www.zuugle.at",
            "zuugle.at",
            "Bahnhöfe in Österreich"
          )}
          {generateLinkEntry(
            "https://www.zuugle.de",
            "zuugle.de",
            "Bahnhöfe in Deutschland"
          )}
          {generateLinkEntry(
            "https://www.zuugle.de",
            "zuugle.ch",
            "Bahnhöfe in der Schweiz"
          )}
          {generateLinkEntry(
            "https://www.zuugle.it",
            "zuugle.it",
            "Bahnhöfe in Slowenien"
          )}
          {generateLinkEntry(
            "https://www.zuugle.it",
            "zuugle.it",
            "Bahnhöfe in Italien"
          )}
        </Fragment>
      );
    } else if (host.indexOf("www.zuugle.fr") >= 0) {
      return (
        <Fragment>
          {generateLinkEntry(
            "https://www.zuugle.at",
            "zuugle.at",
            "Bahnhöfe in Österreich"
          )}
          {generateLinkEntry(
            "https://www.zuugle.de",
            "zuugle.de",
            "Bahnhöfe in Deutschland"
          )}
          {generateLinkEntry(
            "https://www.zuugle.ch",
            "zuugle.ch",
            "Bahnhöfe in der Schweiz"
          )}
          {generateLinkEntry(
            "https://www.zuugle.si",
            "zuugle.it",
            "Bahnhöfe in Slowenien"
          )}
          {generateLinkEntry(
            "https://www.zuugle.it",
            "zuugle.it",
            "Bahnhöfe in Italien"
          )}
        </Fragment>
      );
    } else if (host.indexOf("www.zuugle.si") >= 0) {
      return (
        <Fragment>
          {generateLinkEntry(
            "https://www.zuugle.at",
            "zuugle.at",
            "Bahnhöfe in Österreich"
          )}
          {generateLinkEntry(
            "https://www.zuugle.de",
            "zuugle.de",
            "Bahnhöfe in Deutschland"
          )}
          {generateLinkEntry(
            "https://www.zuugle.ch",
            "zuugle.ch",
            "Bahnhöfe in der Schweiz"
          )}
          {generateLinkEntry(
            "https://www.zuugle.fr",
            "zuugle.fr",
            "Bahnhöfe in Frankreich"
          )}
          {generateLinkEntry(
            "https://www.zuugle.it",
            "zuugle.it",
            "Bahnhöfe in Italien"
          )}
        </Fragment>
      );
    } else if (host.indexOf("www2.zuugle.at") >= 0) {
      return (
        <Fragment>
          {generateLinkEntry(
            "https://www2.zuugle.de",
            "UAT zuugle.de",
            "Bahnhöfe in Deutschland"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.ch",
            "UAT zuugle.ch",
            "Bahnhöfe in der Schweiz"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.it",
            "UAT zuugle.it",
            "Bahnhöfe in Italien"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.si",
            "UAT zuugle.si",
            "Bahnhöfe in Slowenien"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.fr",
            "UAT zuugle.fr",
            "Bahnhöfe in Frankreich"
          )}
        </Fragment>
      );
    } else if (host.indexOf("www2.zuugle.de") >= 0) {
      return (
        <Fragment>
          {generateLinkEntry(
            "https://www2.zuugle.at",
            "UAT zuugle.at",
            "Bahnhöfe in Österreich"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.ch",
            "UAT zuugle.ch",
            "Bahnhöfe in der Schweiz"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.it",
            "UAT zuugle.it",
            "Bahnhöfe in Italien"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.fr",
            "UAT zuugle.fr",
            "Bahnhöfe in Frankreich"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.si",
            "UAT zuugle.si",
            "Bahnhöfe in Slowenien"
          )}
        </Fragment>
      );
    } else if (host.indexOf("www2.zuugle.ch") >= 0) {
      return (
        <Fragment>
          {generateLinkEntry(
            "https://www2.zuugle.at",
            "UAT zuugle.at",
            "Bahnhöfe in Österreich"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.de",
            "UAT zuugle.de",
            "Bahnhöfe in Deutschland"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.it",
            "UAT zuugle.it",
            "Bahnhöfe in Italien"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.it",
            "UAT zuugle.fr",
            "Bahnhöfe in Frankreich"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.it",
            "UAT zuugle.si",
            "Bahnhöfe in Slowenien"
          )}
        </Fragment>
      );
    } else if (host.indexOf("www2.zuugle.it") >= 0) {
      return (
        <Fragment>
          {generateLinkEntry(
            "https://www2.zuugle.at",
            "UAT zuugle.at",
            "Bahnhöfe in Österreich"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.de",
            "UAT zuugle.de",
            "Bahnhöfe in Deutschland"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.de",
            "UAT zuugle.ch",
            "Bahnhöfe in der Schweiz"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.it",
            "UAT zuugle.it",
            "Bahnhöfe in Slowenien"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.it",
            "UAT zuugle.it",
            "Bahnhöfe in Italien"
          )}
        </Fragment>
      );
    } else if (host.indexOf("www2.zuugle.fr") >= 0) {
      return (
        <Fragment>
          {generateLinkEntry(
            "https://www2.zuugle.at",
            "UAT zuugle.at",
            "Bahnhöfe in Österreich"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.de",
            "UAT zuugle.de",
            "Bahnhöfe in Deutschland"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.ch",
            "UAT zuugle.ch",
            "Bahnhöfe in der Schweiz"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.si",
            "UAT zuugle.it",
            "Bahnhöfe in Slowenien"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.it",
            "UAT zuugle.it",
            "Bahnhöfe in Italien"
          )}
        </Fragment>
      );
    } else if (host.indexOf("www2.zuugle.si") >= 0) {
      return (
        <Fragment>
          {generateLinkEntry(
            "https://www2.zuugle.at",
            "UAT zuugle.at",
            "Bahnhöfe in Österreich"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.de",
            "UAT zuugle.de",
            "Bahnhöfe in Deutschland"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.ch",
            "UAT zuugle.ch",
            "Bahnhöfe in der Schweiz"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.fr",
            "UAT zuugle.fr",
            "Bahnhöfe in Frankreich"
          )}
          {generateLinkEntry(
            "https://www2.zuugle.it",
            "UAT zuugle.it",
            "Bahnhöfe in Italien"
          )}
        </Fragment>
      );
    }
  };

  const generateLinkEntry = (url, linkText, label) => {
    // console.log("L54 : URL passed to list item",url)
    // console.log("L55 : linkText passed to list item",linkText)
    // console.log("L56 : label passed to list item",label)
    return (
      <ListItem
        onMouseDown={() => {
          window.location.href = url;
        }} //sets up a redirect to the specified URL when the mouse button is pressed down on the ListItem.
        sx={{ borderBottom: "1px solid #ECECEC" }}
        className={"cursor-link"}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="go"
            onMouseDown={() => {
              window.location.href = url;
            }}
          >
            <Typography>{linkText}</Typography>
            <ChevronRightLight />
          </IconButton>
        }
      >
        <ListItemText primary={label} />
      </ListItem>
    );
  };

  const notFoundEntry = () => {
    return (
      <ListItem className={"not-found-entry"}>
        <ListItemText
          primary={
            <Typography>
              <Typography sx={{ fontWeight: 800 }}>
                Deinen nahegelegenen Bahnhof nicht gefunden?
              </Typography>
              <Typography sx={{ maxWidth: "700px" }}>
                Wir erweitern laufend die verfügbaren Ausgangspunkte und die
                Touren.
              </Typography>
            </Typography>
          }
        />
      </ListItem>
    );
  };

  const writeCityToLocalStorage = (city) => {
    localStorage.setItem("city", city);
  };

  let _cities =
    !!cities && cities.length > 5 && !!sliceCities
      ? cities.slice(0, 5)
      : cities;

  return (
    <List>
      {!!isCityLoading && false && (
        <ListItem sx={{ backgroundColor: "#FFFFFF" }}>
          <Box sx={{ padding: "20px" }}>
            <CircularProgress />
          </Box>
        </ListItem>
      )}
      {cities.map((_city, index) => {
        return (
          <ListItem
            key={index}
            onMouseDown={(event) => {
              setCity(_city);
              setCityInput(_city.label);
              if (!!onFocusCity) {
                onFocusCity(false);
              }
              if (!!onSelect) {
                onSelect(_city);
              }

              searchParams.set("city", _city.value);
              setSearchParams(searchParams);

              //load regions initially
              loadRegions({ city: _city.value });

              //wenn startseite lade touren
              if (!!_city && !!_city.value) {
                loadFavouriteTours({
                  sort: "relevanz",
                  city: _city.value,
                  limit: 10,
                  ranges: true,
                });
                writeCityToLocalStorage(_city.value);
              }
            }}
            sx={{
              borderRadius: "12px",
              padding: "5px",
              mb: "5px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#EBEBEB",
              },
            }}
            // secondaryAction={
            //     <IconButton edge="end" aria-label="go">
            //         <ChevronRightLight />
            //     </IconButton>
            // }
          >
            <ListItemAvatar>
              <Avatar sx={{ borderRadius: "11px", background: "#DDD" }}>
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.879883 1.29848C0.879883 0.872922 1.23279 0.52002 1.65834 0.52002H9.96193C13.5117 0.52002 16.2934 1.36076 18.2032 2.80351C20.1338 4.26701 21.1199 6.31177 21.1199 8.56412C21.1199 9.32183 20.8189 10.0484 20.2791 10.5777C19.7394 11.1175 19.0128 11.4185 18.2655 11.4185H1.65834C1.23279 11.4185 0.879883 11.0656 0.879883 10.64C0.879883 10.4428 0.952539 10.256 1.07709 10.121C0.952539 9.98611 0.879883 9.79928 0.879883 9.60207V1.29848ZM6.06963 2.07694H2.43681V5.70976H6.06963V2.07694ZM7.62655 5.70976V2.07694H9.96193C10.4083 2.07694 10.8442 2.08732 11.2594 2.11846V5.70976H7.62655ZM12.8163 5.70976V2.29491C14.7157 2.6063 16.1896 3.22907 17.2587 4.04905C17.9022 4.53688 18.4108 5.09737 18.7845 5.70976H12.8163ZM19.4176 7.26669C19.5111 7.68187 19.563 8.1178 19.563 8.56412C19.563 8.90664 19.428 9.23879 19.1789 9.47752C18.9402 9.71625 18.608 9.86156 18.2655 9.86156H2.39529C2.42643 9.77852 2.43681 9.69549 2.43681 9.60207V7.26669H19.4176Z"
                    fill="#101010"
                  />
                  <path
                    d="M1.65834 14.0134C1.23279 14.0134 0.879883 14.3663 0.879883 14.7918C0.879883 15.2174 1.23279 15.5703 1.65834 15.5703H20.3414C20.767 15.5703 21.1199 15.2174 21.1199 14.7918C21.1199 14.3663 20.767 14.0134 20.3414 14.0134H1.65834Z"
                    fill="#101010"
                  />
                </svg>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={_city.label} />
          </ListItem>
        );
      })}
      {/* {(!!_cities ? _cities : []).map((_city, index) => {
        return (
          <ListItem
            key={index}
            onMouseDown={(event) => {
              setCity(_city);
              setCityInput(_city.label);
              if (!!onFocusCity) {
                onFocusCity(false);
              }
              if (!!onSelect) {
                onSelect(_city);
              }

              searchParams.set("city", _city.value);
              setSearchParams(searchParams);

              //load regions initially
              loadRegions({ city: _city.value });

              //wenn startseite lade touren
              if (!!_city && !!_city.value) {
                loadFavouriteTours({
                  sort: "relevanz",
                  city: _city.value,
                  limit: 10,
                  ranges: true,
                });
                writeCityToLocalStorage(_city.value);
              }
            }}
            sx={{
              borderRadius: "12px",
              padding: "5px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#EBEBEB",
              },
            }}
            // secondaryAction={
            //     <IconButton edge="end" aria-label="go">
            //         <ChevronRightLight />
            //     </IconButton>
            // }
          >
            <ListItemAvatar>
              <Avatar sx={{ borderRadius: "11px", background: "#DDD" }}>
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.879883 1.29848C0.879883 0.872922 1.23279 0.52002 1.65834 0.52002H9.96193C13.5117 0.52002 16.2934 1.36076 18.2032 2.80351C20.1338 4.26701 21.1199 6.31177 21.1199 8.56412C21.1199 9.32183 20.8189 10.0484 20.2791 10.5777C19.7394 11.1175 19.0128 11.4185 18.2655 11.4185H1.65834C1.23279 11.4185 0.879883 11.0656 0.879883 10.64C0.879883 10.4428 0.952539 10.256 1.07709 10.121C0.952539 9.98611 0.879883 9.79928 0.879883 9.60207V1.29848ZM6.06963 2.07694H2.43681V5.70976H6.06963V2.07694ZM7.62655 5.70976V2.07694H9.96193C10.4083 2.07694 10.8442 2.08732 11.2594 2.11846V5.70976H7.62655ZM12.8163 5.70976V2.29491C14.7157 2.6063 16.1896 3.22907 17.2587 4.04905C17.9022 4.53688 18.4108 5.09737 18.7845 5.70976H12.8163ZM19.4176 7.26669C19.5111 7.68187 19.563 8.1178 19.563 8.56412C19.563 8.90664 19.428 9.23879 19.1789 9.47752C18.9402 9.71625 18.608 9.86156 18.2655 9.86156H2.39529C2.42643 9.77852 2.43681 9.69549 2.43681 9.60207V7.26669H19.4176Z"
                    fill="#101010"
                  />
                  <path
                    d="M1.65834 14.0134C1.23279 14.0134 0.879883 14.3663 0.879883 14.7918C0.879883 15.2174 1.23279 15.5703 1.65834 15.5703H20.3414C20.767 15.5703 21.1199 15.2174 21.1199 14.7918C21.1199 14.3663 20.767 14.0134 20.3414 14.0134H1.65834Z"
                    fill="#101010"
                  />
                </svg>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={_city.label} />
          </ListItem>
        );
      })} */}
      {/* {!!cities && cities.length > 5 && !!sliceCities && (
        <>
          <Divider sx={{ mt: "12px" }} />
          <ListItem
            sx={{
              paddingLeft: "20px",
              cursor: "pointer",
            }}
          >
            <ListItemText
              onMouseDown={() => {
                setSliceCities(false);
                setTimeout(() => {
                  setOpenCitySearch(true);
                }, 10);
              }}
              color={"#4992FF"}
              secondary={`${cities.length - 5} weitere einblenden`}
              secondaryTypographyProps={{
                color: "#4992FF",
              }}
            />
          </ListItem>
        </>
      )} */}
      {!cities.length && (
        <ListItem>
          <ListItemText secondary={"Did not find anything?"} />
        </ListItem>
      )}

      {renderLinksBasedOnHost()}
      {!!showNotFoundEntry && notFoundEntry()}
    </List>
  );
}
