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

L.tileLayer("https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution: "",
}).addTo(map);

if (gpxTrackUrls.length > 0) {
    new L.GPX(gpxTrackUrls[0], {
        async: true,
        marker_options: {
            startIconUrl:
                gpxTrackUrls.length == 1 ? "../img/startpunkt.svg" : "../img/transparent.png",
            endIconUrl:
                gpxTrackUrls.length == 1 ? "../img/zielpunkt.svg" : "../img/transparent.png",
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
        })
        .addTo(map);
}

if (gpxTrackUrls.length > 1) {
    new L.GPX(gpxTrackUrls[1], {
        async: true,
        marker_options: {
            startIconUrl: "transparent.png",
            endIconUrl: "../img/zielpunkt.svg",
        },
        polyline_options: {
            color: "#001D47",
            opacity: 1,
            weight: 6,
            lineCap: "round",
        },
    }).addTo(map);
}

if (gpxTrackUrls.length > 2) {
    new L.GPX(gpxTrackUrls[2], {
        async: true,
        marker_options: {
            startIconUrl: "../img/startpunkt.svg",
            endIconUrl: "../img/zielpunkt.svg",
        },
        polyline_options: {
            color: "#001D47",
            opacity: 1,
            weight: 6,
            lineCap: "round",
        },
    })
        .on("loaded", function (e) {
            hideEndMarkerIfRoundTrip(e.layers);
        })
        .addTo(map);
}
