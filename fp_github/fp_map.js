//--create map
var map = L.map("map", {
  center: [44.1544061, -88.2929276],
  zoom: 14,
});

/*creating basemaps*/
var satellite_base = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

//-- mini map
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

// color palette trail
function getTrailColor(value) {
return value === "Hike" ? '#5286e4' :
           value === "Horse and Bike" ? '#f0cf65' :
           'red'; // obvious fallback
}

//color for slow
function getSlopeColor (value) {
    return value < 5 ? '#38A800' :
            value < 10 ? '#8DD400' :
            value < 15 ? '#FFFF00' :
            value < 30 ? '#FF8000' :
            '#FF0000';
}

function styleTrail(feature){
    return { 
        weight: 4,
        opacity: 0.7,
        color: getTrailColor(feature.properties.FIRST_Type)
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

// highlight function
function highlightFeatures(e) {
    var layer = e.target;
    
    layer.setStyle({
        weight: 5.5,
        opacity: 1
    });
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// reset functions
function resetTrailHighlight(e) {
    hikeLayer.resetStyle(e.target);
    horseBikeLayer.resetStyle(e.target);

    e.target.closePopup();
}


// interaction functions
function onEachTrailFeature(feature, layer) {
    layer.bindPopup(
        '<strong>' + feature.properties.Name + '</strong><br>' + feature.properties.SUM_Miles + ' miles'
    );
    
    layer.on({
        mouseover: function (e) {
            highlightFeatures(e);
            e.target.openPopup();
        },
        mouseout: resetTrailHighlight,
        
        click: function (e) {
            map.fitBounds(e.target.getBounds());
        }
    });
}

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

var slopelayer = L.geoJSON(slope, {
    style: styleSlope
});

var parkboundary = L.geoJSON(boundary, {
    style: styleBound
}).addTo(map);

var roadlines = L.geoJSON(road, {
    style: styleroad
}).addTo(map);

var parkinglots = L.geoJSON(parking,  {
    style: styleparking
});

var parkingIcon = L.icon({
    iconUrl: 'images/parking.png',
    iconSize: [20, 20],
    iconAnchor: [12, 12]
});

var parkpoints = L.geoJSON(lots, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: parkingIcon });
    }
});

var parkingLayer = L.layerGroup([parkinglots, parkpoints]).addTo(map);


// build legend
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

var baseLayers = {
     'Satellite Imagery' : satellite_base
    };
var overlays={
    "Hiking Trails": hikeLayer,
    "Horseback Riding & Biking Trails": horseBikeLayer,
    "Slope": slopelayer,
    "Roads": roadlines,
    "Parking Areas": parkingLayer,
};
var layerControl = L.control.layers(baseLayers, overlays , {collapsed: false}).addTo(map);

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