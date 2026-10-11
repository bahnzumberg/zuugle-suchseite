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

// Coordinates of London. This is used as fallback on error to detect invalid images.
var map = L.map("map", { zoomControl: false, attributionControl: false });

window.__MAP_READY__ = false;
window.__MAP_ERROR__ = false;

var tileLayer = L.tileLayer("https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution: "",
});

var fired = false;
function markReady() {
    if (fired) return;
    fired = true;
    window.__MAP_READY__ = true;
}

function attachTileListeners() {
    tileLayer.on("load", markReady);

    var tileTimer;
    tileLayer.on("tileload tileerror", function () {
        clearTimeout(tileTimer);
        tileTimer = setTimeout(function () {
            if (!tileLayer._loading) {
                markReady();
            }
        }, 300);
    });

    setTimeout(function () {
        if (!tileLayer._loading) {
            markReady();
        }
    }, 200);

    // Maximaler Sicherheits-Timeout nach fitBounds (3s):
    // Verhindert langes Warten, falls eine einzelne Kachel am Server trödelt
    setTimeout(markReady, 3000);
}

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
            map.fitBounds(e.target.getBounds().pad(0.15), { animate: false });
            hideEndMarkerIfRoundTrip(e.layers);
            attachTileListeners();
            tileLayer.addTo(map);
        })
        .on("error", function () {
            map.setView([51.505, -0.09], 14);
            attachTileListeners();
            tileLayer.addTo(map);
            window.__MAP_ERROR__ = true;
        })
        .addTo(map);

    // Sicherheits-Timeout (10s): Falls GPX-Download komplett hängt
    setTimeout(function () {
        if (!window.__MAP_READY__) {
            map.setView([51.505, -0.09], 14);
            attachTileListeners();
            tileLayer.addTo(map);
            window.__MAP_ERROR__ = true;
        }
    }, 10000);
} else {
    map.setView([51.505, -0.09], 14);
    attachTileListeners();
    tileLayer.addTo(map);
}

