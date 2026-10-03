var gpxTrackUrls = [];
if (window.location.search.length > 0) {
    var splitted = window.location.search.substring(1).split("&");
    for (var i = 0; i < splitted.length; i++) {
        var entry = splitted[i];
        if (entry.length > 0) {
            var values = entry.split("=");
            if (values.length == 2) {
                gpxTrackUrls.push(values[1]);
            }
        }
    }
}

// Hide the end marker (zielpunkt) if start and end positions are the
// same (round trip). Coordinates are compared rounded to 3 decimal
// places (~111 m precision) so tiny GPS deviations are ignored.
function hideEndMarkerIfRoundTrip(gpxLayer) {
    var startMarker = null;
    var endMarker = null;
    gpxLayer.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            var url = (layer.options.icon && layer.options.icon.options.iconUrl) || "";
            if (url.indexOf("startpunkt") >= 0) {
                startMarker = layer;
            } else if (url.indexOf("zielpunkt") >= 0) {
                endMarker = layer;
            }
        }
    });
    if (startMarker && endMarker) {
        var sLL = startMarker.getLatLng();
        var eLL = endMarker.getLatLng();
        if (
            sLL.lat.toFixed(3) === eLL.lat.toFixed(3) &&
            sLL.lng.toFixed(3) === eLL.lng.toFixed(3)
        ) {
            gpxLayer.removeLayer(endMarker);
        }
    }
    if (startMarker) {
        startMarker.setZIndexOffset(1000);
    }
}

// Coordinates of London. This is easy to check and to replace with a valid image.
var map = L.map("map", { zoomControl: false, attributionControl: false }).setView(
    [51.505, -0.09],
    14,
);

window.__MAP_READY__ = false;
window.__MAP_ERROR__ = false;

var tileLayer = L.tileLayer("https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution: "",
}).addTo(map);

if (gpxTrackUrls.length > 0) {
    new L.GPX(gpxTrackUrls[0], {
        async: true,
        marker_options: {
            startIconUrl: "../img/startpunkt.svg",
            endIconUrl: "../img/zielpunkt.svg",
            shadowUrl: "../img/pin-shadow.png",
        },
        polyline_options: {
            color: "#001D47",
            opacity: 1,
            weight: 6,
            lineCap: "round",
        },
    })
        .on("loaded", function (e) {
            map.fitBounds(e.target.getBounds().pad(0.15));
            hideEndMarkerIfRoundTrip(e.layers);

            var fired = false;
            function markReady() {
                if (fired) return;
                fired = true;
                window.__MAP_READY__ = true;
            }

            // Wenn alle Kacheln regulär geladen sind
            tileLayer.on("load", markReady);

            // Debounce: Wenn die meisten Kacheln da sind und keine neuen Kacheln mehr laden
            var tileTimer;
            tileLayer.on("tileload tileerror", function () {
                clearTimeout(tileTimer);
                tileTimer = setTimeout(function () {
                    if (!tileLayer._loading) {
                        markReady();
                    }
                }, 600);
            });

            // Schneller Fallback falls die Kacheln bereits geladen / gecached sind
            setTimeout(function () {
                if (!tileLayer._loading) {
                    markReady();
                }
            }, 300);

            // Maximaler Sicherheits-Timeout nach fitBounds (5s):
            // Verhindert langes Warten, falls eine einzelne Kachel am Server trödelt
            setTimeout(markReady, 5000);
        })
        .on("error", function () {
            window.__MAP_ERROR__ = true;
        })
        .addTo(map);

    // Sicherheits-Timeout: Falls GPX-Download komplett hängt oder fehlschlägt
    setTimeout(function () {
        if (!window.__MAP_READY__) {
            window.__MAP_ERROR__ = true;
        }
    }, 8000);
} else {
    tileLayer.on("load", function () {
        window.__MAP_READY__ = true;
    });
    if (!tileLayer._loading) {
        window.__MAP_READY__ = true;
    }
}

