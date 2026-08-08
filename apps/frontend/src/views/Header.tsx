import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getBackgroundImageUrl, getDomainText, getTLD } from "../utils/globals";

export interface HeaderProps {
  title: string;
  subTitle?: string;
  backgroundColor?: string;
}

export default function Header({
  title,
  subTitle,
  backgroundColor,
}: HeaderProps) {
  return (
    <Box
      className={"header-container utils"}
      sx={{
        ...(backgroundColor
          ? { backgroundColor }
          : {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.56)), url(${getBackgroundImageUrl(getTLD(), false)})`,
            }),
        paddingLeft: 0,
        height: "300px",
      }}
    >
      <Box
        className={"header-text"}
        style={{
          maxWidth: "1000px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 0,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
        >
          <img
            src={`https://cdn.zuugle.at/img/zuugle_weiss.svg`}
            height={"16px"}
            width={"29px"}
            alt="Zuugle Logo"
          />
          <Typography
            style={{
              fontSize: "16px",
              color: "#FFF",
              lineHeight: "16px",
              marginLeft: "5px",
            }}
          >
            {getDomainText()}
          </Typography>
        </Box>
        <Typography variant={"h1"}>{title}</Typography>
        {!!subTitle && (
          <Typography style={{ color: "#FFF" }}>{subTitle}</Typography>
        )}
      </Box>
    </Box>
  );
}
