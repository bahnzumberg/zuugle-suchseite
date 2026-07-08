import Box from "@mui/material/Box";
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
    ? `https://cdn.bahn-zum-berg.at/wp-content/uploads/zuugle/zuugle-${tld}.jpg?aspect_ratio=500:570&width=500`
    : `https://cdn.bahn-zum-berg.at/wp-content/uploads/zuugle/zuugle-${tld}.jpg?aspect_ratio=1200:798&width=1200`;

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
