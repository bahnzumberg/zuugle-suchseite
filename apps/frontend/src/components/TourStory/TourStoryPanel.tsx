import { useMemo } from "react";
import Box from "@mui/material/Box";
import { sanitizeStoryHtml } from "./sanitizeStoryHtml";

export interface TourStoryPanelProps {
  /** The sanitized or raw HTML of the article */
  contentHtml: string;
}

export default function TourStoryPanel({ contentHtml }: TourStoryPanelProps) {
  const safeHtml = useMemo(() => sanitizeStoryHtml(contentHtml), [contentHtml]);

  if (!safeHtml || safeHtml.trim().length === 0) {
    return null;
  }

  return (
    <Box
      component="section"
      className="tour-story-panel"
      sx={{
        width: "100%",
        mb: "50px",
        bgcolor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid rgba(37, 73, 128, 0.12)",
        boxShadow: "0 2px 12px rgba(37, 73, 128, 0.04)",
        p: { xs: "20px 16px", sm: "32px 28px", md: "40px 40px" },
        boxSizing: "border-box",
      }}
    >
      {/* ─── Gutenberg Story Body (100% available width) ─── */}
      <Box
        dangerouslySetInnerHTML={{ __html: safeHtml }}
        sx={{
          width: "100%",
          color: "#101010",
          "& p": {
            fontFamily: '"Source Sans 3", "Helvetica", "Arial", sans-serif',
            fontSize: { xs: "16px", sm: "18px" },
            lineHeight: 1.75,
            color: "#101010",
            mb: "22px",
            width: "100%",
          },
          "& h2": {
            fontFamily: '"Source Sans 3", "Helvetica", "Arial", sans-serif',
            fontSize: { xs: "24px", sm: "28px" },
            fontWeight: 700,
            color: "#101010",
            mt: "36px",
            mb: "14px",
            lineHeight: 1.3,
          },
          "& h3": {
            fontFamily: '"Source Sans 3", "Helvetica", "Arial", sans-serif',
            fontSize: { xs: "18px", sm: "22px" },
            fontWeight: 700,
            color: "#101010",
            mt: "28px",
            mb: "12px",
          },
          "& a": {
            color: "var(--bzb-akelei)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            transition: "color 0.2s ease",
            "&:hover": {
              color: "var(--bzb-bahnblau)",
            },
          },
          "& blockquote, & blockquote.wp-block-quote": {
            my: "28px",
            width: "100%",
            boxSizing: "border-box",
            p: { xs: "16px 20px", sm: "20px 24px" },
            bgcolor: "rgba(37, 73, 128, 0.05)",
            borderLeft: "4px solid var(--bzb-akelei)",
            borderRadius: "0 12px 12px 0",
            "& p": {
              m: 0,
              fontSize: { xs: "15px", sm: "17px" },
              lineHeight: 1.7,
              color: "#222",
              fontStyle: "italic",
            },
          },
          "& figure.wp-block-image": {
            my: { xs: "24px", sm: "36px" },
            mx: 0,
            width: "100%",
            "& a": {
              display: "block",
              width: "100%",
              borderRadius: "12px",
              overflow: "hidden",
            },
            "& img": {
              width: "100%",
              height: "auto",
              maxHeight: { xs: "450px", md: "650px" },
              objectFit: "cover",
              display: "block",
              borderRadius: "12px",
              boxShadow: "0 4px 18px rgba(0, 0, 0, 0.06)",
            },
            "& figcaption": {
              fontSize: "13px",
              color: "#666",
              textAlign: "center",
              mt: "10px",
              fontStyle: "italic",
            },
          },
          "& figure.wp-block-gallery": {
            my: { xs: "24px", sm: "36px" },
            mx: 0,
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: "16px",
            "& figure.wp-block-image": {
              my: 0,
              mx: 0,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              "& a": {
                display: "block",
                width: "100%",
                borderRadius: "10px",
                overflow: "hidden",
              },
              "& img": {
                width: "100%",
                height: { xs: "240px", sm: "340px" },
                objectFit: "cover",
                borderRadius: "10px",
                display: "block",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              },
            },
            "& figcaption.blocks-gallery-caption": {
              gridColumn: { sm: "1 / -1" },
              fontSize: "13px",
              color: "#666",
              textAlign: "center",
              mt: "6px",
              fontStyle: "italic",
            },
          },
        }}
      />
    </Box>
  );
}
