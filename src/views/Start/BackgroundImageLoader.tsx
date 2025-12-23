import Box from "@mui/material/Box";
import { isMobileDevice } from "../../utils/globals";

const LINEAR_GRADIENT =
  "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.45)), ";

export interface BackgroundImageLoaderProps {
  tld: string;
  sx?: object;
  children: React.ReactNode;
}

const BackgroundImageLoader = ({
  tld,
  sx,
  children,
}: BackgroundImageLoaderProps) => {
  const backgroundImage = isMobileDevice()
    ? `${LINEAR_GRADIENT} url(https://cdn.zuugle.at/img/background_start_mobil_${tld}.webp)`
    : `${LINEAR_GRADIENT} url(https://cdn.zuugle.at/img/background_start_small_${tld}.webp)`;

  return (
    <Box
      className={"header-container"}
      sx={{
        backgroundImage: backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default BackgroundImageLoader;
