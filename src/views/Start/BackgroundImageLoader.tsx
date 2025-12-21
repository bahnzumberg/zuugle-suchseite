import { Box } from "@mui/material";

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
  return (
    <Box
      className={"header-container"}
      sx={{
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <picture>
          <source
            media="(max-width: 900px)"
            srcSet={`https://cdn.zuugle.at/img/background_start_mobil_${tld}.webp`}
          />
          <img
            src={`https://cdn.zuugle.at/img/background_start_small_${tld}.webp`}
            alt="Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            fetchPriority="high"
          />
        </picture>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.45))",
          }}
        />
      </Box>
      <Box sx={{ position: "relative", zIndex: 1, height: "100%" }}>
        {children}
      </Box>
    </Box>
  );
};

export default BackgroundImageLoader;
