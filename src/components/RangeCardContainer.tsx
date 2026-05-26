import { useRef, useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import RangeCard from "./RangeCard";
import { RangeObject } from "../features/apiSlice";
import { useIsMobile } from "../utils/muiUtils";
import { Link } from "react-router";

const GAP = 16;
const MIN_TILE_WIDTH = 280;
const AUTOPLAY_DELAY = 3500;
const PAUSE_AFTER_INTERACTION = 7000;

export interface RangeCardContainerProps {
  ranges: RangeObject[];
}

export default function RangeCardContainer({
  ranges,
}: RangeCardContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tileWidth, setTileWidth] = useState(392);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();

  const isPausedRef = useRef(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Responsive tile width: fill container, always show complete tiles
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const count = Math.max(
        1,
        Math.floor((width + GAP) / (MIN_TILE_WIDTH + GAP)),
      );
      setTileWidth((width - (count - 1) * GAP) / count);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      containerRef.current?.scrollTo({
        left: index * (tileWidth + GAP),
        behavior: "smooth",
      });
    },
    [tileWidth],
  );

  const pause = useCallback(() => {
    isPausedRef.current = true;
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, PAUSE_AFTER_INTERACTION);
  }, []);

  // Autoplay
  useEffect(() => {
    const id = setInterval(() => {
      if (isPausedRef.current) return;
      const el = containerRef.current;
      if (!el) return;
      const current = Math.round(el.scrollLeft / (tileWidth + GAP));
      const count = ranges?.length ?? 0;
      const visible = Math.max(
        1,
        Math.floor((el.clientWidth + GAP) / (tileWidth + GAP)),
      );
      const lastStart = Math.max(0, count - visible);
      // if we're at or past the last possible start index, loop to 0
      scrollToIndex(current >= lastStart ? 0 : current + 1);
    }, AUTOPLAY_DELAY);
    return () => clearInterval(id);
  }, [tileWidth, ranges?.length, scrollToIndex]);

  // Mouse drag handlers (desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    scrollStartRef.current = containerRef.current?.scrollLeft ?? 0;
    setIsDragging(true);
    pause();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const delta = dragStartXRef.current - e.clientX;
    if (Math.abs(delta) > 5) hasDraggedRef.current = true;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollStartRef.current + delta;
    }
  };

  const finishDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    const el = containerRef.current;
    if (!el) return;
    const count = ranges?.length ?? 1;
    const visible = Math.max(
      1,
      Math.floor((el.clientWidth + GAP) / (tileWidth + GAP)),
    );
    const lastStart = Math.max(0, count - visible);
    const rawIndex = Math.round(el.scrollLeft / (tileWidth + GAP));
    const index = Math.max(0, Math.min(rawIndex, lastStart));
    scrollToIndex(index);
  };

  const items = ranges?.length > 0 ? ranges : [];

  if (isMobile) {
    return (
      <Box
        ref={containerRef}
        onTouchStart={pause}
        sx={{
          display: "flex",
          gap: `${GAP}px`,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {items.map((range, index) => (
          <Box
            key={index}
            sx={{
              flex: `0 0 ${tileWidth}px`,
              minWidth: `${tileWidth}px`,
              scrollSnapAlign: "start",
            }}
          >
            <Link
              to={`/search/?range=${range.range}`}
              draggable={false}
              style={{ display: "block" }}
            >
              <RangeCard range={range} />
            </Link>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={finishDrag}
      onMouseLeave={finishDrag}
      onClickCapture={(e) => {
        if (hasDraggedRef.current) {
          e.preventDefault();
          e.stopPropagation();
          hasDraggedRef.current = false;
        }
      }}
      sx={{
        display: "flex",
        gap: `${GAP}px`,
        overflowX: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      {items.map((range, index) => (
        <Box
          key={index}
          sx={{
            flex: `0 0 ${tileWidth}px`,
            minWidth: `${tileWidth}px`,
          }}
        >
          <Link
            to={`/search/?range=${range.range}`}
            draggable={false}
            style={{ display: "block" }}
          >
            <RangeCard range={range} />
          </Link>
        </Box>
      ))}
    </Box>
  );
}
