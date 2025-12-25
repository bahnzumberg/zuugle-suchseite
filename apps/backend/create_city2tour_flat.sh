#!/bin/bash

# Check if container name is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <container_name>"
    exit 1
fi

CONTAINER_NAME=$1

echo "Creating table city2tour_flat in container $CONTAINER_NAME..."

docker exec -i "$CONTAINER_NAME" psql -U postgres -d zuugle_suchseite_dev <<EOF
DROP TABLE IF EXISTS city2tour_flat;
CREATE TABLE IF NOT EXISTS city2tour_flat (
    reachable_from_country varchar(2) NOT NULL,
    city_slug varchar(64) NOT NULL,
    id int NOT NULL,
    provider varchar(30),
    provider_name varchar(150) NOT NULL,
    hashed_url varchar(100),
    url varchar(1024),
    title varchar(255),
    image_url varchar(1024),
    type varchar(255),
    country varchar(128),
    state varchar(128),
    range_slug varchar(128),
    range varchar(128),
    text_lang VARCHAR(2),
    difficulty_orig varchar(45),
    season varchar(1),
    max_ele INT,
    connection_arrival_stop_lon decimal(12,9),
    connection_arrival_stop_lat decimal(12,9),
    min_connection_duration int,
    max_connection_duration int,
    min_connection_no_of_transfers INTEGER,
    avg_total_tour_duration decimal(6,2),
    ascent int,
    descent int,
    difficulty int,
    duration decimal(6,2),
    distance decimal(6,2),
    number_of_days int,
    traverse int,
    quality_rating integer,
    month_order int,
    search_column tsvector,
    ai_search_column vector(1024),
    stop_selector char(1),
    PRIMARY KEY (reachable_from_country, city_slug, id)
);

INSERT INTO city2tour_flat (
    reachable_from_country, city_slug, id, provider, provider_name, hashed_url, url, 
    title, image_url, type, country, state, range_slug, range, 
    text_lang, difficulty_orig, season, max_ele, 
    connection_arrival_stop_lon, connection_arrival_stop_lat, 
    min_connection_duration, max_connection_duration, min_connection_no_of_transfers, 
    avg_total_tour_duration, ascent, descent, difficulty, duration, 
    distance, number_of_days, traverse, quality_rating, month_order, 
    search_column, ai_search_column, stop_selector
)
SELECT DISTINCT
    c2t.reachable_from_country,
    c2t.city_slug,
    t.id, 
    t.provider, 
    p.provider_name,
    t.hashed_url, 
    t.url, 
    t.title, 
    t.image_url,
    t.type, 
    t.country, 
    t.state, 
    t.range_slug, 
    t.range, 
    t.text_lang, 
    t.difficulty_orig,
    t.season,
    t.max_ele,
    c2t.connection_arrival_stop_lon,
    c2t.connection_arrival_stop_lat,
    c2t.min_connection_duration,
    c2t.max_connection_duration,
    c2t.min_connection_no_of_transfers, 
    c2t.avg_total_tour_duration,
    t.ascent, 
    t.descent, 
    t.difficulty, 
    t.duration, 
    t.distance, 
    t.number_of_days, 
    t.traverse, 
    t.quality_rating,
    t.month_order,
    t.search_column,
    t.ai_search_column,
    c2t.stop_selector
FROM city2tour AS c2t 
INNER JOIN tour AS t ON c2t.tour_id = t.id
INNER JOIN provider AS p ON t.provider = p.provider;

CREATE INDEX IF NOT EXISTS city2tour_flat_ai_search_idx ON city2tour_flat USING hnsw (ai_search_column vector_l2_ops);
CREATE INDEX IF NOT EXISTS city2tour_flat_search_idx ON city2tour_flat USING GIN (search_column);
CREATE INDEX IF NOT EXISTS city2tour_flat_stop_selector_idx ON city2tour_flat (stop_selector);
CREATE INDEX IF NOT EXISTS city2tour_flat_text_lang_idx ON city2tour_flat (text_lang);
CLUSTER city2tour_flat USING city2tour_flat_pkey;
ANALYZE city2tour_flat;
EOF

if [ $? -eq 0 ]; then
    echo "Table created successfully."
else
    echo "Error creating table."
    exit 1
fi
