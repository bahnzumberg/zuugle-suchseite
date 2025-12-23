import { Box } from "@mui/material";
import { useHead } from "@unhead/react";
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
  const imageUrl = isMobileDevice()
    ? `https://cdn.zuugle.at/img/background_start_mobil_${tld}.webp`
    : `https://cdn.zuugle.at/img/background_start_small_${tld}.webp`;

  // Preload the LCP image for faster loading
  useHead({
    link: [
      {
        rel: "preload",
        as: "image",
        href: imageUrl,
        fetchpriority: "high",
      },
    ],
  });

  const backgroundImage = `${LINEAR_GRADIENT} url(${imageUrl})`;

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
