/* eslint-disable */
console.log(locations);
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW9oc2VuNTQiLCJhIjoiY2t0cHE4MWFlMGY3bTJ1bDM4dzE2dWttaSJ9.-tlXCY3Xbz5NNA9_O1pplg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mohsen54/cktpsq7sj2jcl19ndknhgblk9',
    scrollZoom: false,
    // center: [-118.440617, 34.047475],
    // zoom: 10,
    // interactive: false,
  });
  // mapboxgl.accessToken =
  //   'pk.eyJ1IjoibW9oc2VuNTQiLCJhIjoiY2t0cHE4MWFlMGY3bTJ1bDM4dzE2dWttaSJ9.-tlXCY3Xbz5NNA9_O1pplg';
  // var map = new mapboxgl.Map({
  //   container: 'map',
  //   style: 'mapbox://styles/mohsen54/cku2m9xha3kkx17phm07ff4jo',
  //   // center: [-118.440617, 34.047475],
  //   // zoom: 10,
  //   // interactive: false,
  //   scrollZoom: false,
  // });
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    /// create  marker
    const el = document.createElement('div');
    el.className = 'marker';
    ///// add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    ///// add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}:${loc.description}</p>`)
      .addTo(map);
    /// extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      buttom: 150,
      left: 100,
      right: 200,
    },
  });
};
