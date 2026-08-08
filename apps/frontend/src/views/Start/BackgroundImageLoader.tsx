import Box from "@mui/material/Box";
import { useHead } from "@unhead/react";
import { getBackgroundImageUrl } from "../../utils/globals";

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
  const imageUrl = getBackgroundImageUrl(tld);

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
