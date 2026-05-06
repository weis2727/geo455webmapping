//--create map
var map = L.map("map", {
  center: [44.15468066767886, -88.29157753901738],
  zoom: 14,
});

// initialize almostOver
if (L.almostOver) {
    map.almostOver = L.almostOver(map);
    map.almostOver.setOptions({ tolerance: 6 });
}

/*creating basemaps*/
var satellite_base = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);
var light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
});

//-- mini map
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: false,
  minimized: false,
  position: "bottomleft"
}).addTo(map);

// trail dashes
function getTrailDash(value) {
return value === "Hike" ? '' :
           value === "Horse and Bike" ? '5, 10' :
           ''; // obvious fallback
}
// color for trails
// generate 11 unique trail colors (HSL wheel)
function getTrailColor(value) {
    return value === "Lime-Kiln Trail" ? '#33A02C':
            value === "Indian Mound Trail" ? '#a5ddfa':
            value === "Red Bird Trail" ? '#E31A1C':
            value === "Butterfly Pond Trail" ? '#c4a3eb':
            value === "North Trail System" ? '#fd8a89':
            value === "Forest Mgmt Trail" ? '#B2DF8A':
            value === "Openfield Trail" ? '#43a3e3':
            value === "Overlook Trail" ? '#FF7F00':
            value === "Woodland Trail" ? '#FDBF6F':
            value === "Shortcut Pass" ? '#ac7fdd':
            value === "South Trail System" ? '#fafa89':
    'grey';

}

//color for slope
function getSlopeColor (value) {
    return value < 5 ? '#38A800' :
            value < 10 ? '#8DD400' :
            value < 15 ? '#FFFF00' :
            value < 30 ? '#FF8000' :
            '#FF0000';
}

function styleTrail(feature){
    return { 
        weight: 4.5,
        opacity: 0.8,
        color: getTrailColor(feature.properties.Name),
        dashArray: getTrailDash(feature.properties.FIRST_Type)
    };
}

function styleSlope(feature){
    return {
        weight: 4,
        opacity: 1,
        color: getSlopeColor(feature.properties.Avg_Slope_Deg)
    };
}

function styleBound(feature) {
    return {
        weight: 3,
        color: 'black',
        fill: false
    };
}

function styleroad(feature) {
    return{
        weight: 2,
        color:'#969696'
    };
}

function styleparking(feature) {
    return{
       fillColor: '#969696',
        fillOpacity: 0.7,
        color: '#7d7d7d',
        opacity: 1,
        weight: 1
    };
}

function getViewshedColor(value) {
    return value === "Northern Overlook" ? "#e41a1c" : 
    value ==="Escarpment Overlook" ? "#377eb8" : 
    value === "Southern Overlook" ? "#984ea3" :
    value === "Observation Tower" ? "#4daf4a" :
    '#bababa';
}

function styleviewshed(feature) {
    return {
        fillColor: getViewshedColor(feature.properties.vis_from),
        fillOpacity: 0.3,
        color: getViewshedColor(feature.properties.vis_from),
        weight: 2
    };
}

var bathroomIcon = L.icon({
    iconUrl: 'images/bathroom_icon.png',
    iconSize: [20, 20],
    iconAnchor: [12, 12]
});

var overlookIcon = L.icon({
    iconUrl: 'images/overlook_icon.png',
    iconSize: [20,20],
    iconAnchor: [12,12]
});

var towerIcon = L.icon({
    iconUrl: 'images/tower_icon.png',
    iconSize: [15,30],
    iconAnchor: [12,12]
});

var overlookMarkers = {};

var officeIcon= L.icon ({
    iconUrl: 'images/park_icon.png',
    iconSize: [20,20],
    iconAnchor: [12,12]
});

function poiMarker(type) {
    return type === "Bathrooms" ? bathroomIcon : officeIcon;
}

function viewPOIMarker(type) {
    return type === "Observation Tower" ? towerIcon : overlookIcon;
}

// highlight function
function highlightFeatures(e) {
    var layer = e.target;
    
    layer.setStyle({
        weight: 6,
        opacity: 1
    });
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// reset functions
function resetTrailHighlight(e) {
    if (hikeLayer.hasLayer(e.target)) {
        hikeLayer.resetStyle(e.target);
    }
    if (horseBikeLayer.hasLayer(e.target)) {
        horseBikeLayer.resetStyle(e.target);
    }

    e.target.closePopup();
}

// interaction functions
function onEachTrailFeature(feature, layer) {
    layer.bindPopup(
        '<strong>' + feature.properties.Name + '</strong><br>' + feature.properties.SUM_Miles + ' miles'
    );

    map.almostOver.addLayer(layer);

    layer.on({
        click: function (e) {
            map.fitBounds(e.target.getBounds());
        }
    });
}

function onEachParkingFeature(feature, layer) {
    layer.on({
 
        click: function (e) {
            map.fitBounds(e.target.getBounds());
        }
    });
}

function onEachParkingPointFeature(feature, layer) {
    layer.on({
 
        click: function (e) {
            map.setView(e.latlng, 18);
        }
    });
}

function toTitleCase(str) {
  if (!str) return "Unnamed Road";
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function onEachRoadFeature(feature,layer) {
    var name = feature.properties.NAME;
    
    layer.bindPopup(toTitleCase(name));
}

function onEachPOIFeature(feature, layer){
    layer.bindPopup('<strong>' + feature.properties.type + '<strong>');
}

function onEachviewPOI (feature, layer) {
layer.bindPopup('<strong>' + feature.properties.Name);
 }

function highlightOverlook(name) {
    var marker = overlookMarkers[name];
    if (!marker) return;

    marker.setZIndexOffset(1000);

    if (marker._icon) {
        marker._icon.classList.add("hover-highlight");
    }
}

function resetOverlook(name) {
    var marker = overlookMarkers[name];
    if (!marker) return;

    marker.setZIndexOffset(0);

    if (marker._icon) {
        marker._icon.classList.remove("hover-highlight");
    }
}

// add the data
var hikeLayer = L.geoJSON(trails, {
    filter: function (feature) {
        return feature.properties.FIRST_Type === "Hike";
    },
    style: styleTrail,
    onEachFeature: onEachTrailFeature
}).addTo(map);

var horseBikeLayer = L.geoJSON(trails, {
    filter: function (feature) {
        return feature.properties.FIRST_Type === "Horse and Bike";
    },
    style: styleTrail,
    onEachFeature: onEachTrailFeature
}).addTo(map);


map.on('almost:over', function (e) {
    var layer = e.layer;

    highlightFeatures({ target: layer });
    layer.openPopup();
});

map.on('almost:out', function (e) {
    resetTrailHighlight({ target: e.layer });
});

var slopelayer = L.geoJSON(slope, {
    style: styleSlope
});

var parkboundary = L.geoJSON(boundary, {
    style: styleBound
}).addTo(map);

var roadlines = L.geoJSON(road, {
    style: styleroad,
    onEachFeature: onEachRoadFeature
}).addTo(map);

var parkinglots = L.geoJSON(parking,  {
    style: styleparking,
    onEachFeature: onEachParkingFeature
});

var parkingIcon = L.icon({
    iconUrl: 'images/parking.png',
    iconSize: [20, 20],
    iconAnchor: [12, 12]
});

var parkpoints = L.geoJSON(lots, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: parkingIcon });
    },
    onEachFeature: onEachParkingPointFeature
});

var parkingLayer = L.layerGroup([parkinglots, parkpoints]).addTo(map);

var poiLayer = L.geoJSON(poi, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: poiMarker(feature.properties.type)
        });
    },
    onEachFeature: onEachPOIFeature
}).addTo(map);

var ViewpoiLayer = L.geoJSON(viewpoints, {
    pointToLayer: function (feature, latlng) {
        var marker = L.marker(latlng, {
            icon: viewPOIMarker(feature.properties.type)
        });

        // store marker by name for hover linking
        overlookMarkers[feature.properties.Name] = marker;

        return marker;
    },
    onEachFeature: onEachviewPOI
}).addTo(map);

var northView = L.geoJSON(view, {
    filter: function (feature) {
        return feature.properties.vis_from === "Northern Overlook";
    },
    style: styleviewshed
});

var escarpmentView = L.geoJSON(view, {
    filter: function (feature) {
        return feature.properties.vis_from === "Escarpment Overlook";
    },
    style: styleviewshed
});

var southView = L.geoJSON(view, {
    filter: function (feature) {
        return feature.properties.vis_from === "Southern Overlook";
    },
    style: styleviewshed
});

var towerView = L.geoJSON(view, {
    filter: function (feature) {
        return feature.properties.vis_from === "Observation Tower";
    },
    style: styleviewshed
});

function toggleLayer(layer) {
    if (map.hasLayer(layer)) {
        map.removeLayer(layer);
    } else {
        map.addLayer(layer);
    }
}
function toggleLayerZoom(layer) {
    if (map.hasLayer(layer)) {
        map.removeLayer(layer);
    } else {
        map.addLayer(layer);
        map.fitBounds(layer.getBounds());
    }
}

// build slope legend
function buildLegendHTML(title, grades, colorFunction) {
    var html = '<div class="legend-title">' + title + '</div>';
    
    for (var i=0; i <grades.length; i++) {
        var from = grades[i];
        var to = grades[i +1];
        
        html +=
            '<div class="legend-box">' +
                '<span class="legend-color" style="background:' + colorFunction(from + 1) + '"></span>' + 
                '<span>' + from + (to ? '&ndash;' + to : '+') + '</span>' +
                '</div>';
    }
    
    return html;
}

// inset slope legend into side panel
var slopeLegendDiv = document.getElementById('slope-legend');
if (slopeLegendDiv) {
    slopeLegendDiv.innerHTML = buildLegendHTML(
    'Slope Intensity (% Rise)',
    [0, 5, 10, 15, 30],
    getSlopeColor
    );
    //hide by default
    slopeLegendDiv.style.display = 'none';
}

//build trail usage legend
function buildTrailLegend() {
    var html = '<div class="legend-title">Trail Types</div>';

    html +=
        '<div class="legend-box">' +
            '<span class="legend-line solid-line"></span>' +
            '<span>Hiking Trails</span>' +
        '</div>' +

        '<div class="legend-box">' +
            '<span class="legend-line dashed-line"></span>' +
            '<span>Horseback Riding & Biking Trails</span>' +
        '</div>';

    return html;
}

// insert trail legend into side panel
var trailLegendDiv = document.getElementById('trail-legend');
if (trailLegendDiv) {
    trailLegendDiv.innerHTML = buildTrailLegend();
}
//-- search
var searchLayers = L.featureGroup([
    hikeLayer,
    horseBikeLayer
]);
var searchControl = new L.Control.Search({
    position:'topright',
    layer: searchLayers,
    propertyName: 'Name',
    marker: false,
    markeranimate: true,
    delayType: 50,
    collapsed: false,
    textPlaceholder: 'Search by Trail Name: e.g. Red Bird Trail',   
    moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 16);
    }
});
searchControl.addTo(map);

searchControl.on('search:locationfound', function(e) {
    var layer = e.layer;

    highlightFeatures({ target: layer });

    layer.openPopup();
});

//layer control
var baseLayers = {
     'Satellite Imagery' : satellite_base,
     'Street Map' : light
    };
var overlays={
    "Hiking Trails": hikeLayer,
    "Horseback Riding & Biking Trails": horseBikeLayer,
    "Slope": slopelayer,
    "Roads": roadlines,
    "Parking Areas": parkingLayer,
    "Points of Interest": poiLayer,
    "Scenic Overlooks": ViewpoiLayer,
};
var layerControl = L.control.layers(baseLayers, overlays , {collapsed: true}).addTo(map);

// build poi legend
function buildPOILegend() {
    var html = '<div class="legend-title">Points of Interest</div>';

    var categories = [
        { label: "Bathrooms", icon: "images/bathroom_icon.png" },
        { label: "Scenic Overlooks", icon: "images/overlook_icon.png" },
        { label: "Observation Towers", icon: "images/tower_icon.png" },
        { label: "Park Office", icon: "images/park_icon.png" }
    ];

    categories.forEach(function(cat) {
        html +=
            '<div class="legend-box">' +
                '<img src="' + cat.icon + '" style="width:18px; height:18px; margin-right:8px;">' +
                '<span>' + cat.label + '</span>' +
            '</div>';
    });

    return html;
}

//intsert poi legend into side panel
var poiLegendDiv = document.getElementById('poi-legend');
if (poiLegendDiv) {
    poiLegendDiv.innerHTML = buildPOILegend();
}

//return to orignial view
var homeCenter = map.getCenter();
var homeZoom = map.getZoom();

L.easyButton('<img src="images/home_icon.png" style="height:70%;">', function () {
  map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

// info button
L.easyButton('<img src="images/info_icon.png" style="height:70%;">', function() {
    window.open('map_info.html', '_blank');
}, 'Map Info').addTo(map);

//automatically show and hide slope legend

map.on('overlayadd', function (e) {
    if (e.layer === slopelayer) {
        document.getElementById('slope-legend').style.display = 'block';
    }
});

map.on('overlayremove', function (e) {
    if (e.layer === slopelayer) {
        document.getElementById('slope-legend').style.display = 'none';
    }
});

//automatically show and hide trail legend
function updateTrailLegend() {
    var legend = document.getElementById('trail-legend');

    if (map.hasLayer(hikeLayer) || map.hasLayer(horseBikeLayer)) {
        legend.style.display = 'block';   // at least one is ON
    } else {
        legend.style.display = 'none';    // both are OFF
    }
}
map.on('overlayadd', updateTrailLegend);
map.on('overlayremove', updateTrailLegend);

//auto hide/show poi legend
map.on('overlayadd', function (e) {
    if (e.layer === poiLayer) {
        document.getElementById('poi-legend').style.display = 'block';
    }
});

map.on('overlayremove', function (e) {
    if (e.layer === poiLayer) {
        document.getElementById('poi-legend').style.display = 'none';
    }
});

// automatically hide/show veiwshed buttons
var viewshedBtnDiv = document.getElementById('viewshed-buttons');

viewshedBtnDiv.style.display = 'block';

map.on('overlayadd', function (e) {
    if (e.layer === ViewpoiLayer) {
        viewshedBtnDiv.style.display = 'block';
    }
});

map.on('overlayremove', function (e) {
    if (e.layer === ViewpoiLayer) {
        viewshedBtnDiv.style.display = 'none';
    }
});

//geolocate
L.geolet({ position: 'topleft' }).addTo(map);

//toggle mini map
var toggleBtn = L.easyButton({
  states: [{
    stateName: 'shown',
    title: 'Hide Mini Map',
    onClick: function(btn, map) {
      miniMap._minimize();
      btn.state('hidden');
    },
    icon: '<span class="mini-map-label">Hide Mini Map</span>'
  }, {
    stateName: 'hidden',
    title: 'Show Mini Map',
    onClick: function(btn, map) {
      miniMap._restore();
      btn.state('shown');
    },
    icon: '<span class="mini-map-label">Show Mini Map</span>'
  }]
}).setPosition('bottomleft').addTo(map);

// styling
toggleBtn._container.classList.add('mini-map-toggle-btn');


