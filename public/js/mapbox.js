<<<<<<< HEAD
/* eslint-disable */
// export const displayMap = (locations) => {
// export const displayMap = (locations) => {
//   mapboxgl.accessToken =
//     'pk.eyJ1IjoibW9oc2VuNTQiLCJhIjoiY2t1bGRzeWpiMGlkMjJzbW9qMGs4d2h5diJ9.0f78q5zsP3tnDVYvAmphbA';

//   var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mohsen54/ckwkjqr6s332215mwir2x5nhz',
//     scrollZoom: false,
//     // center: [-118.113491,34.111745],
//     // zoom: 10,
//     // interactive: false,
//   });

//   const bounds = new mapboxgl.LngLatBounds();

//   locations.forEach((loc) => {
//     /// create  marker
//     const el = document.createElement('div');
//     el.className = 'marker';
//     ///// add marker
//     new mapboxgl.Marker({
//       element: el,
//       anchor: 'bottom',
//     })
//       .setLngLat(loc.coordinates)
//       .addTo(map);
//     ///// add popup
//     new mapboxgl.Popup({
//       offset: 30,
//     })
//       .setLngLat(loc.coordinates)
//       .setHTML(`<p> Day ${loc.day}:${loc.description} </p>`)
//       .addTo(map);
//     /// extend map bounds to include current location
//     bounds.extend(loc.coordinates);
//   });
//   map.fitBounds(bounds, {
//     padding: {
//       top: 200,
//       buttom: 150,
//       left: 100,
//       right: 100,
//     },
//   });
// };
=======
/* eslint-disable */
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW9oc2VuNTQiLCJhIjoiY2t1bW9xaDRrMGNuMDMxb2FubmQ5cHBmdiJ9._fOqWcfupeLcIfkeJHViyQ';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mohsen54/ckump58hy532n18mrkxzf7zkk',
    scrollZoom: false,
  });
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
      right: 100,
    },
  });
};
>>>>>>> 024680879414b02d43b59233d8440d713cc76efb
