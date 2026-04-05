//--create map
var map = L.map("map", {
  center: [28.972443641658437, 84.59443216376953],
  zoom: 8,
});

/*creating basemaps*/
var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2NoYXVkaHVyaSIsImEiOiJjazBtcG5odG8wMDltM2JtcjdnYTgyanBnIn0.qwqjMomdrBMG36GQKXBlMw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

//-- mountain peaks
var myIcon = L.icon({
    iconUrl: 'images/peaks.png',
    iconSize: [20, 20],
    iconAnchor: [10, 15],
    popupAnchor: [1, -24],
});

var peaks = new L.geoJson(mtn_peaks, {
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindPopup(
            '<p>Peak Name: <b>' + feature.properties.TITLE + '</b></br>' +
            'Peak Height: ' + feature.properties.Peak_Heigh + ' m</br>' +
            'Number of Deaths: ' + feature.properties.number_of_ + '</br>' + 
            'Number of Expeditions: ' + feature.properties.number_of1 + '</p>'
        );
    },
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {icon: myIcon});
    }
}).addTo(map);

//-- proportional circles
function getRadius(exp) {
    if (exp <= 10) return 5;
    else if (exp <= 50) return 10;
    else if (exp <= 100) return 15;
    else if (exp <= 1000) return 25;
    else return 40;
}

var propcircles = new L.geoJson(mtn_peaks, {
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindPopup(
            '<p> Peak Name: <b>' + feature.properties.TITLE + '</b></br>' + 
            'Number of Expeditions: ' + feature.properties.number_of1 + '</p>'
        );
    },
   pointToLayer: function(feature, latlng) {
    if (feature.properties.number_of1 > 0)
    return L.circleMarker(latlng, {
        fillColor: '#920101',
        color: '#920101',
        weight: 2,
        radius: getRadius(feature.properties.number_of1),
        fillOpacity: 0.35
    }).on({
        mouseover: function(e) {
            this.openPopup();
            this.setStyle({fillOpacity: 0.8, fillColor: '#2D8F4E'});
        },
        mouseout: function(e) {
            this.closePopup();
            this.setStyle({fillOpacity: 0.35, fillColor: '#920101'});
        }
    });
}
});

//--heatmap
var min = 0;
var max = 0;
var heatMapPoints = [];

mtn_peaks.features.forEach(function(feature) {
    heatMapPoints.push([
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        feature.properties.number_of_
    ]);
    
    if (feature.properties.number_of_ < min || min ===0) {
        min = feature.properties.number_of_;
    }
    
    if (feature.properties.number_of_ > max || max===0) {
        max = feature.properties.number_of_;
    }
});

var heat = L.heatLayer(heatMapPoints, {
    radius: 25,
    minOpacity: 0.5,
    gradient:{0.5: 'blue', 0.75: 'lime', 1: 'red'},
});

//--clusters
var clustermarkers = L.markerClusterGroup();
mtn_peaks.features.forEach(function(feature) {
    clustermarkers.addLayer(L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]));
});


//-- search
var searchControl = new L.Control.Search({
    position:'topright',
    layer: peaks,
    propertyName: 'TITLE',
    marker: false,
    markeranimate: true,
    delayType: 50,
    collapsed: false,
    textPlaceholder: 'Search by Peak Name: e.g. Everest, Lhotse',   
    moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 15);}
});

map.addControl(searchControl); 

//--layercontrol
var overlayMaps = {
    "<img src='images/peaks.png' height=16> Location of Himalayan Peaks": peaks,
    "<img src='images/propcircles.png' height=16> Expeditions Proportional Circles": propcircles,
    "<img src='images/dead.jpg' height=16> Death Density Heat Map": heat,
    "<img src='images/cluster_icon.png' height=16> Clustering of Peaks": clustermarkers,
};

var legend = L.control.layers(overlayMaps, {}, {collapsed: false}).addTo(map);

//--minimap
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(map);

//--original zoom
/*create home button to return to original view*/
var homeCenter = map.getCenter();
var homeZoom = map.getZoom();
L.easyButton(('<img src="images/globe_icon.png", height=70%>'), function () {
  map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

//-- scale bar
L.control.scale({
    position:'bottomright',
    metric: true,
    imperial: true,
}).addTo(map);

//-- jump to highest peak buttons
document.getElementById("btn-ev").addEventListener("click", function () {
  peaks.eachLayer(function(layer) {
    if (layer.feature.properties.TITLE === "Everest") {
      map.setView(layer.getLatLng(), 16);
      layer.openPopup();
    }
  });
});

document.getElementById("btn-lho").addEventListener("click", function () {
  peaks.eachLayer(function(layer) {
    if (layer.feature.properties.TITLE === "Lhotse") {
      map.setView(layer.getLatLng(), 16);
      layer.openPopup();
    }
  });
});

document.getElementById("btn-kang").addEventListener("click", function () {
  peaks.eachLayer(function(layer) {
    if (layer.feature.properties.TITLE === "Kangchenjunga") {
      map.setView(layer.getLatLng(), 16);
      layer.openPopup();
    }
  });
});

//-- prop legend: FIX
function buildPropCircleLegend(title, grades) {
    var html = '<div class="legend-title">' + title + '</div>';

    for (var i = 0; i < grades.length; i++) {
        var value = grades[i];
        var next = grades[i + 1];
        var radius = getRadius(value);
        var size = radius * 2 + 6;

        html +=
            '<div class="legend-item" style="display:flex; align-items:center; margin-bottom:6px;">' +

                '<svg width="' + size + '" height="' + size + '" style="margin-right:8px;">' +
                '<circle cx="' + (size/2) + '" cy="' + (size/2) + '" r="' + radius + '" ' +
                    'fill="#920101" fill-opacity="0.35" stroke="#920101" stroke-width="2"/>' +
                '</svg>' +
                '<span>' + value + (next ? '–' + next : '+') + '</span>' +

            '</div>';
    }

    return html;
}

var grades = [1, 10, 50, 100, 1000];


var propLegendDiv = document.getElementById('prop-legend');

if (propLegendDiv) {
    propLegendDiv.innerHTML = buildPropCircleLegend(
        'Number of Expeditions',
        grades
    );
}