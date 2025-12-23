import { Box } from "@mui/material";
import { isMobileDevice } from "../../utils/globals";

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

  return (
    <Box
      className={"header-container"}
      sx={{
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
    >
      {/* LCP-optimized image */}
      <img
        src={imageUrl}
        alt="Hintergrund"
        fetchPriority="high"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      {/* Gradient overlay for contrast */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.45))",
          zIndex: -1,
        }}
      />

      {children}
    </Box>
  );
};

export default BackgroundImageLoader;
