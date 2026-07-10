import "./StartSkeleton.css";

/**
 * Ultra-lightweight skeleton loader for the Start page.
 * Uses ONLY plain HTML elements and CSS - NO MUI imports.
 * This keeps the initial bundle extremely small.
 */
export default function StartSkeleton() {
  return (
    <div className="skeleton-container">
      {/* Hero Section with Background */}
      <div className="skeleton-hero">
        {/* Logo placeholder */}
        <div className="skeleton-logo" />
        {/* Title placeholder */}
        <div className="skeleton-title" />
        {/* Search bar placeholder */}
        <div className="skeleton-search" />
      </div>

      {/* Content Section */}
      <div className="skeleton-content">
        {/* Section title */}
        <div className="skeleton-section-title" />

        {/* Tour cards */}
        <div className="skeleton-cards">
          <div className="skeleton-card" style={{ animationDelay: "0s" }} />
          <div className="skeleton-card" style={{ animationDelay: "0.1s" }} />
          <div className="skeleton-card" style={{ animationDelay: "0.2s" }} />
          <div className="skeleton-card" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    </div>
  );
}
