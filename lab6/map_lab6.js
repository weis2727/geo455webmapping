//--create map
var map = L.map("map", {
  center: [51.48882027639122, -0.1028811094342392],
  zoom: 11,
});

/*creating basemaps*/
 L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
   attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.',
   maxZoom: 11,
   minZoom: 5
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

// color palette density
function getColorDensity(value) {
    return value > 139 ? '#54278f':
           value > 87  ? '#756bb1':
           value > 53  ? '#9e9ac8':
           value > 32  ? '#cbc9e2':
                         '#f2f0f7';
}

function styleDensity(feature){
    return {
        fillColor: getColorDensity(feature.properties.pop_den),   
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
} 
// color palette lang
function getColorLang(value) {
    return value > 6.5 ? '#006d2c':
           value > 4.5  ? '#2ca25f':
           value > 2.5  ? '#66c2a4':
           value > 1  ? '#b2e2e2':
                         '#edf8fb';
}

function styleLang(feature) {
    return {
        fillColor: getColorLang(feature.properties.lang_dens),   
        weight: 2,
        opacity: 1,
        color: '#e6e6e6',
        fillOpacity: 0.9
    };
}

// highlight function
function highlightFeatures(e) {
    var layer = e.target;
    
    layer.setStyle({
        weight: 4,
        color: '#666',
        fillOpacity: 0.7
    });
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        feature.bringToFront();
    }
}

// reset functions
function resetDensityHighlight(e) {
    densitylayer.resetStyle(e.target);
    e.target.closePopup();
}

function resetLangHighlight(e) {
    langlayer.resetStyle(e.target);
    e.target.closePopup();
}

// interaction functions
function onEachDensityFeature(feature, layer) {
    layer.bindPopup(
        '<strong>' + feature.properties.NAME + '</strong><br>' +
        '<span style="color:purple">' + feature.properties.pop_den + ' people/hectare </span>'
    );
    
    layer.on({
        mouseover: function (e) {
            highlightFeatures(e);
            e.target.openPopup();
        },
        mouseout: resetDensityHighlight
    });
}

function onEachLangFeature(feature, layer) {
    layer.bindPopup(
        '<strong>' + feature.properties.name + '</strong><br>' +
        '<span style="color:green">' + feature.properties.lang_dens + ' people/hectare </span>'
    );
    
    layer.on({
        mouseover: function (e) {
            highlightFeatures(e);
            e.target.openPopup();
        },
        mouseout: resetLangHighlight
    });
}

// add dataset
var densitylayer = L.geoJSON(data, {
    style: styleDensity,
    onEachFeature: onEachDensityFeature
}).addTo(map);

var langlayer = L.geoJSON(datalangnone, {
    style: styleLang,
    onEachFeature: onEachLangFeature
}).addTo(map);

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

// inset density legend into side panel
var densityLegendDiv = document.getElementById('density-legend');
if (densityLegendDiv) {
    densityLegendDiv.innerHTML = buildLegendHTML(
    'Population Density',
    [0, 32, 53, 87, 139],
    getColorDensity
    );
}

var langLegendDiv = document.getElementById('language-legend');
if (langLegendDiv) {
    langLegendDiv.innerHTML = buildLegendHTML(
    'Non English Speaking Households',
    [0, 1, 2.5, 4.5, 6.5],
    getColorLang
    );
}

var baseLayers = {
    'Population Density': densitylayer,
    'Non English Speaking Households' : langlayer
    };
var overlays={};
var layerControl = L.control.layers(baseLayers, overlays , {collapsed: false}).addTo(map);
