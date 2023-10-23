SELECT
    "id", "url", "provider", "hashed_url", "description", "image_url",
    "ascent", "descent", "difficulty", "difficulty_orig", "duration", "distance", "title", 
    "type", "number_of_days", "traverse", "country", "state", "range_slug", "range", 
    "season", "month_order", "publishing_date", "quality_rating", "user_rating_avg", 
    "cities", "cities_object", "max_ele"
FROM
    "tour"
WHERE
    "id" IN (
        SELECT "tour_id" FROM "city2tour" WHERE "city_slug" = 'amstetten'
    )
    AND "ascent" <= 100000
    AND "descent" <= 100000
    AND "distance" <= 1000
    AND "difficulty" <= 10
    AND (
        "range" IN (
            'Alpenvorland','Ankogelgruppe','Bayerischer Wald','Berchtesgadener Alpen',
            'Brandenberger Alpen','Burgenland','Chiemgauer Alpen','Dachsteingebirge',
            'Ennstaler Alpen','Goldberggruppe','Gutensteiner Alpen','Hochschwabgruppe',
            'Kaisergebirge','Karpaten','Karwendel','Kitzbüheler Alpen','Kreuzeckgruppe',
            'Lavanttaler Alpen','Loferer und Leoganger Steinberge','Mühlviertel',
            'Mürzsteger Alpen','Niederösterreich','Oberösterreich','Oberösterreichische Voralpen',
            'Randgebirge östlich der Mur','Rax-Schneeberg-Gruppe','Salzburger Schieferalpen',
            'Salzkammergut-Berge','Schladminger Tauern','Seckauer Tauern','Stubaier Alpen',
            'Totes Gebirge','Türnitzer Alpen','Waldviertel','Wien','Wienerwald',
            'Ybbstaler Alpen','Zillertaler Alpen'
        )
    )
    AND (
        "type" IN (
            'Bike & Hike','Hochtour','Klettern','Klettersteig','Langlaufen','Schneeschuh',
            'Skitour','Wandern','Weitwandern'
        )
    )
    AND "text_lang" IN ('de')
    AND (
        "cities_object"->'amstetten'->>'best_connection_duration')::int >= 4.8 
    AND (
        "cities_object"->'amstetten'->>'best_connection_duration')::int <= 309
ORDER BY
    "month_order" ASC,
    FLOOR((
        "cities_object"->'amstetten'->>'best_connection_duration')::int / ("traverse" + 1) / 30
    ) * 30 ASC,
    "id" % date_part('day', NOW() )::INTEGER ASC;
