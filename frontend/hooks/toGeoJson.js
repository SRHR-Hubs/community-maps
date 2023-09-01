const toGeoJSON = (data) => {
  return {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: data.map(({ _geo, ...properties }) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [_geo.lng, _geo.lat],
        },
        properties,
      })),
    },
  };
};

export default toGeoJSON;
