import { useState, useRef, useEffect } from "react";

interface CityOption {
  city_slug: string;
  city_name: string;
  country_code: string;
}

interface ResolvedCity {
  city_slug: string;
  city_name: string;
  country_code: string;
}

interface SearchResult {
  success: boolean;
  tourIds: number[];
  tourIdsCount: number;
  tld: string;
  city: string;
  domain: string | null;
  language: string;
  poisCount: number;
  clarification: string | null;
  cityOptions?: CityOption[];
  llm_raw: Record<string, unknown> | null;
  llm_interpretation: Record<string, unknown>;
  syntheticReq: Record<string, unknown> | null;
}

interface ConversationTurn {
  query: string;
  result: SearchResult | null;
  error: string | null;
  elapsed: number;
  /** How many tour links to show (client-side pagination) */
  visibleCount: number;
}

// ─── Filter chip helpers ─────────────────────────────────────────

function buildFilterChips(result: SearchResult): string[] {
  const chips: string[] = [];
  const interp = result.llm_interpretation || {};
  const filter = (interp.filter || {}) as Record<string, unknown>;
  const resolved = interp.resolved_city as ResolvedCity | undefined;

  // City
  if (resolved?.city_name) {
    chips.push(`ab ${resolved.city_name}`);
  } else if (result.city) {
    chips.push(`ab ${result.city}`);
  }

  // Tour types
  if (Array.isArray(filter.types) && filter.types.length > 0) {
    chips.push(filter.types.join(", "));
  }

  // Difficulty
  if (Array.isArray(filter.difficulties)) {
    const labels: Record<number, string> = {
      1: "leicht",
      2: "mittel",
      3: "schwer",
    };
    const mapped = (filter.difficulties as number[]).map(
      (d) => labels[d] || String(d),
    );
    chips.push(mapped.join(", "));
  }

  // Transport duration
  const minT = filter.minTransportDuration as number | undefined;
  const maxT = filter.maxTransportDuration as number | undefined;
  if (minT != null || maxT != null) {
    if (minT != null && maxT != null) {
      chips.push(`Anreise ${minT}–${maxT} h`);
    } else if (maxT != null) {
      chips.push(`Anreise 0–${maxT} h`);
    } else {
      chips.push(`Anreise ab ${minT} h`);
    }
  }

  // Ascent
  const minA = filter.minAscent as number | undefined;
  const maxA = filter.maxAscent as number | undefined;
  if (minA != null || maxA != null) {
    if (minA != null && maxA != null) {
      chips.push(`${minA}–${maxA} Hm`);
    } else if (maxA != null) {
      chips.push(`bis ${maxA} Hm`);
    } else {
      chips.push(`ab ${minA} Hm`);
    }
  }

  // Distance
  const minD = filter.minDistance as number | undefined;
  const maxD = filter.maxDistance as number | undefined;
  if (minD != null || maxD != null) {
    if (minD != null && maxD != null) {
      chips.push(`${minD}–${maxD} km`);
    } else if (maxD != null) {
      chips.push(`bis ${maxD} km`);
    } else {
      chips.push(`ab ${minD} km`);
    }
  }

  // Season
  if (filter.summerSeason === true) chips.push("Sommer");
  if (filter.winterSeason === true) chips.push("Winter");

  // Traverse
  if (filter.traverse === true) chips.push("Überschreitung");

  // Day type
  if (filter.singleDayTour === true) chips.push("Tagestour");
  if (filter.multipleDayTour === true) chips.push("Mehrtages");

  // Search term
  if (typeof interp.search === "string" && interp.search) {
    chips.push(`„${interp.search}"`);
  }

  return chips;
}

function buildTourUrl(
  domain: string | null,
  tourId: number,
  city: string | null,
  lang: string,
): string {
  const d = domain || "www.zuugle.at";
  const base = `https://${d}`;
  const cityPart = city || "";
  return `${base}/tour/${tourId}/${cityPart}?lang=${lang}`;
}

const PAGE_SIZE = 3;

// ─── Component ───────────────────────────────────────────────────

export default function TestLlmSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [lastInterpretation, setLastInterpretation] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const baseURL =
    window.location.host.indexOf("localhost") >= 0
      ? (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api")
      : `${window.location.protocol}//${window.location.host}/api`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, loading]);

  /** Core fetch helper */
  const doSearch = async (
    displayQuery: string,
    bodyOverrides: Record<string, unknown> = {},
  ) => {
    setLoading(true);
    const start = performance.now();

    try {
      const response = await fetch(`${baseURL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: displayQuery,
          page: 1,
          previousInterpretation: lastInterpretation,
          ...bodyOverrides,
        }),
      });

      const data = await response.json();
      const elapsed = Math.round(performance.now() - start);

      if (!response.ok) {
        setTurns((prev) => [
          ...prev,
          {
            query: displayQuery,
            result: null,
            error: `HTTP ${response.status}: ${JSON.stringify(data)}`,
            elapsed,
            visibleCount: PAGE_SIZE,
          },
        ]);
      } else {
        const searchResult = data as SearchResult;
        setTurns((prev) => [
          ...prev,
          {
            query: displayQuery,
            result: searchResult,
            error: null,
            elapsed,
            visibleCount: PAGE_SIZE,
          },
        ]);
        if (searchResult.llm_interpretation) {
          setLastInterpretation(searchResult.llm_interpretation);
        }
      }
    } catch (e) {
      const elapsed = Math.round(performance.now() - start);
      setTurns((prev) => [
        ...prev,
        {
          query: displayQuery,
          result: null,
          error: e instanceof Error ? e.message : "Unknown error",
          elapsed,
          visibleCount: PAGE_SIZE,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /** Handle text input — check for "mehr" command */
  const handleSearch = async () => {
    if (!query.trim() || loading) return;
    const currentQuery = query.trim();
    setQuery("");

    // "mehr" or a number → show more results from the last turn
    if (/^mehr$/i.test(currentQuery) || /^\d+$/.test(currentQuery)) {
      const lastTurn = turns[turns.length - 1];
      if (
        lastTurn?.result &&
        lastTurn.result.tourIdsCount > lastTurn.visibleCount
      ) {
        setTurns((prev) => {
          const updated = [...prev];
          const last = { ...updated[updated.length - 1] };
          last.visibleCount = last.visibleCount + PAGE_SIZE;
          updated[updated.length - 1] = last;
          return updated;
        });
        return;
      }
    }

    await doSearch(currentQuery);
  };

  /** Handle city option selection */
  const handleCitySelect = async (city: CityOption) => {
    await doSearch(city.city_name, { selectedCity: city });
  };

  /** Show more results for a specific turn */
  const handleShowMore = (turnIndex: number) => {
    setTurns((prev) => {
      const updated = [...prev];
      const turn = { ...updated[turnIndex] };
      turn.visibleCount = turn.visibleCount + PAGE_SIZE;
      updated[turnIndex] = turn;
      return updated;
    });
  };

  const resetConversation = () => {
    setLastInterpretation(null);
    setTurns([]);
    setQuery("");
  };

  const hasClarification =
    turns.length > 0 &&
    turns[turns.length - 1]?.result?.clarification &&
    !turns[turns.length - 1]?.result?.cityOptions;

  return (
    <div
      style={{
        width: "90%",
        margin: "0 auto",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#f5f5f5",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          color: "#333",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div>
          <h1 style={{ fontSize: 18, margin: 0, fontWeight: 600 }}>
            🏔 Zuugle Suche
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ fontSize: 11, color: "#aaa", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={showDebug}
              onChange={(e) => setShowDebug(e.target.checked)}
              style={{ marginRight: 4 }}
            />
            Debug
          </label>
          {turns.length > 0 && (
            <button
              onClick={resetConversation}
              style={{
                padding: "6px 14px",
                fontSize: 12,
                background: "#ff5722",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              🔄 Neu
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Empty state */}
        {turns.length === 0 && !loading && (
          <div
            style={{
              textAlign: "center",
              color: "#888",
              marginTop: 60,
              fontSize: 14,
            }}
          >
            <p style={{ fontSize: 40, marginBottom: 8 }}>🏔</p>
            <p>Finde dein nächstes Outdoor-Abenteuer</p>
            <p style={{ fontSize: 12, color: "#aaa" }}>
              z.B. &quot;leichte Wanderung auf den Schneeberg von Wien&quot;
            </p>
          </div>
        )}

        {/* Conversation turns */}
        {turns.map((turn, i) => (
          <div
            key={i}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            {/* User message — right aligned */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  background: "#e8f5e9",
                  borderRadius: "16px 16px 4px 16px",
                  padding: "10px 16px",
                  maxWidth: "60%",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                }}
              >
                <p style={{ margin: 0, fontSize: 14, color: "#333" }}>
                  {turn.query}
                </p>
              </div>
            </div>

            {/* Error */}
            {turn.error && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    background: "#fee",
                    border: "1px solid #fcc",
                    borderRadius: "4px 16px 16px 16px",
                    padding: "8px 12px",
                    maxWidth: "80%",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 13, color: "#c00" }}>
                    Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.
                  </p>
                </div>
              </div>
            )}

            {/* Response — left aligned */}
            {turn.result && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "4px 16px 16px 16px",
                    padding: "14px 18px",
                    maxWidth: "80%",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {/* Clarification question */}
                  {turn.result.clarification && !turn.result.cityOptions && (
                    <p style={{ margin: 0, fontSize: 14, color: "#333" }}>
                      {turn.result.clarification}
                    </p>
                  )}

                  {/* City disambiguation options */}
                  {turn.result.cityOptions &&
                    turn.result.cityOptions.length > 0 && (
                      <div>
                        <p
                          style={{
                            margin: "0 0 8px",
                            fontSize: 14,
                            color: "#333",
                          }}
                        >
                          Meinst du …?
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          {turn.result.cityOptions.map((city, ci) => (
                            <button
                              key={city.city_slug}
                              onClick={() => handleCitySelect(city)}
                              disabled={loading}
                              style={{
                                padding: "8px 12px",
                                fontSize: 14,
                                background: "#f5f5f5",
                                border: "1px solid #e0e0e0",
                                borderRadius: 8,
                                cursor: loading ? "wait" : "pointer",
                                textAlign: "left",
                                transition: "background 0.15s",
                              }}
                              onMouseEnter={(e) =>
                                ((
                                  e.target as HTMLButtonElement
                                ).style.background = "#e8f5e9")
                              }
                              onMouseLeave={(e) =>
                                ((
                                  e.target as HTMLButtonElement
                                ).style.background = "#f5f5f5")
                              }
                            >
                              {ci + 1} – {city.city_name} ({city.country_code})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Tour results */}
                  {turn.result.tourIdsCount > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {/* Result count + filter chips */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#2e7d32",
                          }}
                        >
                          {turn.result.tourIdsCount} Ergebnisse
                        </span>
                        {buildFilterChips(turn.result).map((chip, ci) => (
                          <span
                            key={ci}
                            style={{
                              fontSize: 12,
                              color: "#555",
                              background: "#f0f0f0",
                              borderRadius: 12,
                              padding: "3px 10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {chip}
                          </span>
                        ))}
                      </div>

                      {/* Tour links */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          fontFamily: "monospace",
                          fontSize: 13,
                        }}
                      >
                        {turn.result.tourIds
                          .slice(0, turn.visibleCount)
                          .map((id, ti) => (
                            <a
                              key={id}
                              href={buildTourUrl(
                                turn.result!.domain,
                                id,
                                turn.result!.city,
                                turn.result!.language || "de",
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#1565c0",
                                textDecoration: "none",
                                padding: "4px 0",
                              }}
                              onMouseEnter={(e) =>
                                ((
                                  e.target as HTMLAnchorElement
                                ).style.textDecoration = "underline")
                              }
                              onMouseLeave={(e) =>
                                ((
                                  e.target as HTMLAnchorElement
                                ).style.textDecoration = "none")
                              }
                            >
                              {ti + 1} –{" "}
                              {buildTourUrl(
                                turn.result!.domain,
                                id,
                                turn.result!.city,
                                turn.result!.language || "de",
                              )}
                            </a>
                          ))}
                      </div>

                      {/* "Mehr" button */}
                      {turn.visibleCount < turn.result.tourIdsCount && (
                        <button
                          onClick={() => handleShowMore(i)}
                          style={{
                            alignSelf: "flex-start",
                            padding: "6px 14px",
                            fontSize: 13,
                            background: "transparent",
                            border: "1px solid #ccc",
                            borderRadius: 16,
                            color: "#555",
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            ((e.target as HTMLButtonElement).style.background =
                              "#f5f5f5")
                          }
                          onMouseLeave={(e) =>
                            ((e.target as HTMLButtonElement).style.background =
                              "transparent")
                          }
                        >
                          Mehr anzeigen (
                          {turn.result.tourIdsCount - turn.visibleCount}{" "}
                          weitere)
                        </button>
                      )}
                    </div>
                  )}

                  {/* No results */}
                  {turn.result.tourIdsCount === 0 &&
                    !turn.result.clarification &&
                    !turn.result.cityOptions && (
                      <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
                        Keine Ergebnisse gefunden. Versuche andere Suchbegriffe
                        oder Filter.
                      </p>
                    )}

                  {/* Debug toggle */}
                  {showDebug && (
                    <details
                      style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}
                    >
                      <summary style={{ cursor: "pointer" }}>
                        🔧 Debug ({turn.elapsed}ms)
                      </summary>
                      <pre
                        style={{
                          margin: "4px 0 0",
                          background: "#fafafa",
                          borderRadius: 4,
                          padding: 8,
                          fontSize: 10,
                          overflow: "auto",
                          maxHeight: 300,
                          lineHeight: 1.3,
                        }}
                      >
                        {JSON.stringify(
                          {
                            llm_raw: turn.result.llm_raw,
                            llm_interpretation: turn.result.llm_interpretation,
                            syntheticReq: turn.result.syntheticReq,
                            tourIds: turn.result.tourIds,
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "4px 16px 16px 16px",
                padding: "10px 14px",
                boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
              }}
            >
              <p style={{ margin: 0, fontSize: 13, color: "#888" }}>
                ⏳ Suche läuft…
              </p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div
        style={{
          background: "#fff",
          padding: "12px 24px",
          display: "flex",
          gap: 8,
          flexShrink: 0,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={
            hasClarification
              ? "Antwort eingeben…"
              : lastInterpretation
                ? 'Verfeinern, z.B. "aber leicht" oder "mehr"'
                : "Was möchtest du unternehmen?"
          }
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px 16px",
            fontSize: 15,
            border: "1px solid #e0e0e0",
            borderRadius: 20,
            outline: "none",
            background: "#f9f9f9",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            background: loading ? "#999" : "#4CAF50",
            color: "#fff",
            fontSize: 20,
            cursor: loading ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
