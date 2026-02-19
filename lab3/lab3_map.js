const map = L.map("map").setView([38.90965998691611, -77.01634455659632], 14);

L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

var myIcon1 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon2 = L.icon({
    iconUrl: 'images/icon_2.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon3 = L.icon({
    iconUrl: 'images/icon_3.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon4 = L.icon({
    iconUrl: 'images/icon_4.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon5 = L.icon({
    iconUrl: 'images/icon_5.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon6 = L.icon({
    iconUrl: 'images/icon_6.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon7 = L.icon({
    iconUrl: 'images/icon_7.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon8 = L.icon({
    iconUrl: 'images/icon_8.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon9 = L.icon({
    iconUrl: 'images/icon_9.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon10 = L.icon({
    iconUrl: 'images/icon_10.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon11 = L.icon({
    iconUrl: 'images/icon_11.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon12 = L.icon({
    iconUrl: 'images/icon_12.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});

var nhm = L.marker([38.89111586, -77.0260654], {icon: myIcon4}).bindPopup("<b>Smithsonian Museum of Natural History</b> <br><br><img src='images/nh_sign.JPG' width='200px'>").addTo(map);
var zoo = L.marker([38.92884564, -77.05014029], {icon: myIcon1}).bindPopup("<b>Smithsonian National Zoological Park</b> <br><br><img src='images/zoo_sign.JPG' width='200px'>").addTo(map);
var garden = L.marker([38.88802284, -77.01293998], {icon: myIcon5}).bindPopup("<b>United States Botanical Garden</b> <br><br><img src='images/bot_sign.JPG' width='200px'>").addTo(map);
var portrait = L.marker([38.89771812, -77.02305119], {icon: myIcon3}).bindPopup("<b>National Portrait Gallery</b> <br><br><img src='images/port_sign.JPG' width='200px'>").addTo(map);
var mahis = L.marker([38.89114566, -77.03007236], {icon: myIcon9}).bindPopup("<b>Smithsonian National Museum of American History</b> <br><br><img src='images/mah_dem.JPG' width='200px'>").addTo(map);
var congress = L.marker([38.88879253, -77.00500868], {icon: myIcon6}).bindPopup("<b>Library of Congress</b> <br><br><img src='images/loc.JPG' width='200px'>").addTo(map);
var sc = L.marker([38.89065907, -77.00446126], {icon: myIcon7}).bindPopup("<b>Supreme Court</b> <br><br><img src='images/sc.JPG' width='200px'>").addTo(map);
var capbuild = L.marker([38.88985422, -77.00908982], {icon: myIcon8}).bindPopup("<b>United States Capital Building</b> <br><br><img src='images/capitol.JPG' width='200px'>").addTo(map);
var wh = L.marker([38.89770135, -77.03656199], {icon: myIcon2}).bindPopup("<b>The White House</b> <br><br><img src='images/white_house.JPG' width='200px'>").addTo(map);
var washmon = L.marker([38.88946247, -77.03521437], {icon: myIcon10}).bindPopup("<b>Washington Monument</b> <br><br><img src='images/washmon.JPG' width='200px'>").addTo(map);
var wwii = L.marker([38.88939519, -77.04054329], {icon: myIcon11}).bindPopup("<b>World War II Memorial</b> <br><br><img src='images/wwii.JPG' width='200px'>").addTo(map);
var linc = L.marker([38.88932295, -77.05020522], {icon: myIcon12}).bindPopup("<b>Lincoln Memorial</b> <br><br><img src='images/linc.JPG' width='200px'>").addTo(map);
