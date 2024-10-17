// Initialize map centered on California
const map = L.map('map').setView([37.7749, -122.4194], 5);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors',
}).addTo(map);

// Color function based on earthquake depth
function getColor(depth) {
  return depth > 90 ? '#FF0000' :
         depth > 70 ? '#FF7F00' :
         depth > 50 ? '#FFFF00' :
         depth > 30 ? '#7FFF00' :
         depth > 10 ? '#00FF00' :
                      '#00FF7F';
}

// Marker radius based on magnitude
function getRadius(magnitude) {
  return magnitude ? magnitude * 3 : 1;
}

// Fetch earthquake data from USGS API
const geojsonUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';

d3.json(geojsonUrl).then(data => {
  const earthquakes = data.features;

  earthquakes.forEach(feature => {
    const [lon, lat, depth] = feature.geometry.coordinates;
    const { mag: magnitude, place } = feature.properties;

    L.circleMarker([lat, lon], {
      radius: getRadius(magnitude),
      fillColor: getColor(depth),
      color: '#000',
      weight: 1,
      fillOpacity: 0.8,
    }).addTo(map)
      .bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km<br><b>Location:</b> ${place}`);
  });
}).catch(error => console.error('Error loading data:', error));

// Add legend for depth colors
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'legend');
  const depths = [-10, 10, 30, 50, 70, 90];

  div.innerHTML += '<b>Depth (km)</b><br>';
  depths.forEach((depth, i) => {
    div.innerHTML += `<i style="background:${getColor(depth + 1)}; width: 18px; height: 18px; display: inline-block;"></i> 
                      ${depth}${depths[i + 1] ? `&ndash;${depths[i + 1]}` : '+'}<br>`;
  });

  return div;
};

legend.addTo(map);
