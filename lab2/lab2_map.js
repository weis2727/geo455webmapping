const map = L.map("map").setView([44.26205, -88.41054], 18);

L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

L.marker([44.261665, -88.406397])
  .addTo(map)
  .bindPopup("<b>Bazil's Pub</b><br><br> This is me and my best friend, Paige, in Bazil's! One time, we saw my boyfriend's grandma walking around, she's a regular, and that has been one of my favorite moments here. <br> <br><img src='imgs/bazils.jpg' width='170px'>");

L.marker([44.261673, -88.406448])
  .addTo(map)
  .bindPopup("<b>Firefly Downstairs Pub</b><br><br> This is me and my mom in Firefly! This pub is actually in the basement of Bazil's Pub and me and my friends love to play pool and darts here.<br> <br><img src='imgs/firefly_w_mom.jpg' width='200px'>");

L.marker([44.261665, -88.413003])
  .addTo(map)
  .bindPopup("<b>The Monkey Bar</b><br><br> My boyfriend and I accidently discovered this bar which is hidden above another. This is a jungle themed bar, with all of the decor and drinks being monkey or jungle themed in some way. Me and my friends love coming up here if we are trying to find a place to go where there is a high chance we will be the only ones there. <br> <br><img src='imgs/monkey.jpg' width='170px'>");

L.marker([44.261665, -88.410999])
  .addTo(map)
  .bindPopup("<b>D2 Sports Pub</b><br><br> This is where my friends go when we are looking for a place to be absolutely packed. The group in the photo are my closest friends on the planet! <br> <br><img src='imgs/d2.JPG' width='170px'>");
