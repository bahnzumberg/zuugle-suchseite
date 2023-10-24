select
    "id",
    "url",
    "provider",
    "hashed_url",
    "description",
    "image_url",
    "ascent",
    "descent",
    "difficulty",
    "difficulty_orig",
    "duration",
    "distance",
    "title",
    "type",
    "number_of_days",
    "traverse",
    "country",
    "state",
    "range_slug",
    "range",
    "season",
    "month_order",
    "publishing_date",
    "quality_rating",
    "user_rating_avg",
    "cities",
    "cities_object",
    "max_ele"
from
    "tour"
where
    id IN (
        SELECT
            tour_id
        FROM
            city2tour
        WHERE
            city_slug = 'villach'
    )
    and ascent <= 100000
    and descent >= 800
    and descent <= 100000
    and distance <= 1000
    and difficulty <= 10
    and (
        range in (
            'Alpenvorland',
            'Ankogelgruppe',
            'Berchtesgadener Alpen',
            'Brandenberger Alpen',
            'Chiemgauer Alpen',
            'Dachsteingebirge',
            'Ennstaler Alpen',
            'Gailtaler Alpen',
            'Goldberggruppe',
            'Gurktaler Alpen, Nockberge',
            'Gutensteiner Alpen',
            'Hochschwabgruppe',
            'Kaisergebirge',
            'Karavanke / Karawanken',
            'Karwendel',
            'Kitzbüheler Alpen',
            'Kreuzeckgruppe',
            'Lavanttaler Alpen',
            'Loferer und Leoganger Steinberge',
            'Mürzsteger Alpen',
            'Oberösterreichische Voralpen',
            'Puez-Geisler-Gruppe',
            'Radstädter Tauern',
            'Randgebirge östlich der Mur',
            'Rax-Schneeberg-Gruppe',
            'Rottenmanner und Wölzer Tauern',
            'Salzburger Schieferalpen',
            'Salzkammergut-Berge',
            'Schladminger Tauern',
            'Schobergruppe',
            'Stubaier Alpen',
            'Totes Gebirge',
            'Wienerwald',
            'Zillertaler Alpen'
        )
    )
    and (
        type in (
            'Bike & Hike',
            'Hochtour',
            'Klettern',
            'Klettersteig',
            'Langlaufen',
            'Schneeschuh',
            'Skitour',
            'Wandern'
        )
    )
    and (text_lang in ('de', 'sl'))
    and (
        cities_object -> 'villach' ->> 'best_connection_duration'
    ) :: int >= 7.800000000000001
    and (
        cities_object -> 'villach' ->> 'best_connection_duration'
    ) :: int <= 336
order by
    month_order ASC,
    FLOOR(
        (
            cities_object -> 'villach' ->> 'best_connection_duration'
        ) :: int /(traverse + 1) / 30
    ) * 30 ASC,
    ID % date_part('day', NOW()) :: INTEGER ASC