import React from "react";
import { useState } from "react";
import {
  InputBase,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  ArrowForward,
  ArrowRight,
  Close,
  LocationCityOutlined,
  LocationOn,
  LocationOnOutlined,
} from "@mui/icons-material";

export default function CustomSelect(props) {
  const { options, handleSelect, handleInputChange, searchPhrase } = props;
  console.log("L24 searchPhrase: " + searchPhrase);
  // add searchParam to value of input field if exists
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <>
      <Grid container>
        <Grid xs={10} md={11}>
          <Grid
            container
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "17px",
              border: "1px solid #ccc",
              padding: "10px 0px 10px 10px",
            }}
          >
            <Grid
              xs={2}
              md={1}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <SearchIcon />
            </Grid>
            <Grid xs={8} md={10}>
              <InputBase
                value={ searchPhrase ? searchPhrase : ""}
                autoFocus
                onChange={(event) => {
                  handleInputChange(event?.target?.value);
                }}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") {
                    handleSelect(ev?.target?.value);
                    ev.preventDefault();
                  }
                }}
              />
            </Grid>
            <Grid xs={2} md={1}>
              <div
                style={{
                  borderRadius: "50%",
                  backgroundColor: "#d9d9d9",
                  height: "24px",
                  width: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  onClick={(event) => {
                    handleInputChange("");
                  }}
                >
                  <Close style={{ fontSize: "16px", color: "#8b8b8b" }} />
                </IconButton>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          xs={2}
          md={1}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div
            style={{
              borderRadius: "50%",
              border: "1px solid #d9d9d9",
              height: "40px",
              width: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={(ev) => {
                handleSelect();
                ev.preventDefault();
              }}
            >
              <ArrowForward style={{ fontSize: "24px", color: "#4992ff" }} />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <List>
        {options?.map((option) => {
          return (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleSelect(option?.value);
                }}
              >
                <ListItemIcon>
                  <div
                    style={{
                      borderRadius: "10px",
                      backgroundColor: "#d9d9d9",
                      height: "40px",
                      width: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IconButton>
                      <LocationOnOutlined
                        style={{ fontSize: "24px", color: "#8b8b8b" }}
                      />
                    </IconButton>
                  </div>
                </ListItemIcon>
                <ListItemText primary={option?.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
