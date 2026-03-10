/*creating basemaps*/
var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2NoYXVkaHVyaSIsImEiOiJjazBtcG5odG8wMDltM2JtcjdnYTgyanBnIn0.qwqjMomdrBMG36GQKXBlMw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
});
var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
var topo = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
    layers: 'SRTM30-Colored-Hillshade'
});
var map = L.map("map", {
  center: [26.794952075439587, 20.91148703911037],
  zoom: 3,
  layers: [imagery, topo, streets]
});
/*create home button to return to original view*/
var homeCenter = map.getCenter();
var homeZoom = map.getZoom();
L.easyButton(('<img src="images/globe_icon.png", height=70%>'), function () {
  map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

/*custom popups*/
/*defining each popup for each location*/
var greatwallPopup = "Great Wall of China<br/><img src='images/greatwall.jpg' alt='great wall wiki' width='150px'/>";
var chichenPopup = "Chichen-Itza<br/><img src='images/chich.jpg' alt='chichen itza wiki' width='150px'/>";
var petraPopup = "Petra<br/><img src='images/petrea.jpg' alt='petra wiki' width='150px'/>";
var machPopup = "Machu Pichu<br/><img src='images/mp.JPG' alt='machu pichu wiki' width='150px'/>";
var christPopup = "Christ the Redeemer<br/><img src='images/christ.jpg' alt='christ the redeemer wiki' width='150px'/>";
var coloPopup = "The Colosseum<br/><img src='images/coll.jpg' alt='colosseum wiki' width='150px'/>";
var tajPopup = "Taj Mahal<br/><img src='images/taj.jpg' alt='taj mahal wiki' width='150px'/>";
var customOptions ={'maxWidth': '150','className' : 'custom'};

/*LayerGroup and Data Array*/
var landmarks = L.layerGroup().addTo(map);
var wonders = [
    { name: "Petra", coords: [30.3285, 35.4444], popupHtml: petraPopup},
    { name: "Colosseum", coords: [41.8902, 12.4922], popupHtml: coloPopup },
    { name: "Machu Pichu", coords: [-13.1629, -72.5450], popupHtml : machPopup},
    { name: "Chichen-Itza", coords: [20.6793, -88.5682], popupHtml : chichenPopup},
    { name: "Christ the Redeemer", coords: [-22.9517, -43.2104], popupHtml : christPopup},
    { name: "Taj Mahal", coords: [27.1753, 78.0421], popupHtml : tajPopup},
    { name: "Great Wall of China", coords: [40.4505, 116.5490], popupHtml : greatwallPopup},
    ];

var iconFiles = [
  "images/icon_1.png",
  "images/icon_2.png",
  "images/icon_3.png",
  "images/icon_4.png",
  "images/icon_5.png",
  "images/icon_6.png",
  "images/icon_7.png",
];

var wonderIcons = [];
for (var i = 0; i < iconFiles.length; i++) {
  wonderIcons.push(
    L.icon({
      iconUrl: iconFiles[i],
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -28],
    })
  );
}
 
function addWondersToLayer(dataArray, layerGroup, iconsArray) {
  var markers = [];

  for (var i = 0; i < dataArray.length; i++) {
    var feature = dataArray[i];

    var marker = L.marker(feature.coords, { icon: iconsArray[i] })
      .bindPopup(feature.popupHtml, customOptions)
      .bindTooltip(feature.name, { direction: "top", sticky: true, opacity: 0.9 })
      .addTo(layerGroup);

    markers.push(marker);
  }

  return markers;
}

var wonderMarkers = addWondersToLayer(wonders, landmarks, wonderIcons);

//add buttons to sidebar that zoom to each site
var buttonsDiv = document.getElementById("wonder-buttons");
var wonderZoom = 5; // pick a zoom level you like

for (var i = 0; i < wonders.length; i++) {
  (function(index) {
    // Create a <button>
    var btn = document.createElement("button");
    btn.type = "button";

    // If using Bootstrap, use btn classes. If not, you can use your own CSS.
    btn.className = "btn btn-outline-secondary btn-sm text-start";

    // Use the SAME icon as the marker + show name
    btn.innerHTML =
      '<img src="' + iconFiles[index] + '" style="width:18px;height:18px;margin-right:8px;">' +
      wonders[index].name;

    // When clicked: zoom to the location + open popup
    btn.addEventListener("click", function() {
      map.setView(wonders[index].coords, wonderZoom);
      wonderMarkers[index].openPopup();
    });

    buttonsDiv.appendChild(btn);
  })(i);
}

/* Layer control and Menu Item */
var baseLayers = {
    'Satellite Imagery': imagery,
    "Hillshade": topo,
    'Streetmap': streets,
    };

var overlays = {};
var layerControl = L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(map);

// MiniMap basemap (no key)

var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});

//add ISS
var issIcon = L.icon({
  iconUrl: "images/iss200.png",
  iconSize: [80, 52],
  iconAnchor: [25, 16],
});

var issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

// API endpoint
var api_url = "https://api.wheretheiss.at/v1/satellites/25544";

function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

async function getISS() {
  try {
    var response = await fetch(api_url);
    if (!response.ok) throw new Error("ISS API error");
    var data = await response.json();
    var latitude = data.latitude;
    var longitude = data.longitude;

    issMarker.setLatLng([latitude, longitude]);

    document.getElementById("lat").textContent = latitude.toFixed(3);
    document.getElementById("lon").textContent = longitude.toFixed(3);
    document.getElementById("iss-time").textContent = formatTime(new Date());
  } catch (err) {
    document.getElementById("iss-time").textContent = "ISS unavailable";
  }
}

// Initial call + refresh
getISS();
setInterval(getISS, 1000);

// Jump to ISS button (required feature)
document.getElementById("btn-iss").addEventListener("click", function () {
  var ll = issMarker.getLatLng();
  map.setView([ll.lat, ll.lng], 4);
});

// Add minimap control
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(map);

// Reuse one popup object(cleaner than creating new onees each click)
var clickPopup = L.popup();

function onMapClick(e) {
  var lat = e.latlng.lat;
  var lon = e.latlng.lng;
  
  //Popup at the clicked location
  clickPopup
    .setLatLng(e.latlng)
    .setContent(
      "You clicked the map at: <br>" + 
      "<b>Lat: </b>" + lat.toFixed(5) + "<br>" +
      "<b>Long: </b>" + lon.toFixed(5)
    )
    .openOn(map);
  
  // Update the info panel
  document.getElementById("click-lat").textContent = lat.toFixed(5);
  document.getElementById("click-lon").textContent = lon.toFixed(5);
}

// Leaflet event API

map.on("click", onMapClick);
