require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "esri/widgets/BasemapToggle",
  "esri/widgets/Search",
  "esri/widgets/Home",
  "esri/widgets/Legend",
  "esri/PopupTemplate",
  "dojo/domReady!"
], function (Map, SceneView, FeatureLayer, BasemapToggle, Search, Home, Legend, PopupTemplate) {
  var map = new Map({
    basemap: "streets",
    ground: "world-elevation"
  });

  var view = new SceneView({
    container: "viewDiv",
    map: map,
    viewingMode: "global",
    camera: {
      position: {
        x: -95.7129,
        y: 37.0902,
        z: 10000000
      },
      tilt: 0,
      heading: 0
    }
  });

  // Create a choropleth layer for US states
  const featureLayer = new FeatureLayer({
    url: "https://services2.arcgis.com/bB9Y1bGKerz1PTl5/arcgis/rest/services/ProjSandoval/FeatureServer/0",
    opacity: 0.5,
    renderer: {
      type: "simple", // Use simple renderer
      symbol: {
        type: "simple-fill",
        outline: {
          color: [255, 255, 255, 0.5], // White outline color
          width: 1
        }
      },
      visualVariables: [
        {
          type: "color",
          field: "P0010001", // Replace with the actual field containing population data
          stops: [
            { value: 0, color: [144, 238, 144, 0.7] },        // 0-1000000 (light green)
            { value: 1000000, color: [34, 139, 34, 0.7] },     // 1000001-5000000
            { value: 5000000, color: [0, 128, 0, 0.7] },       // 5000001-10000000
            { value: 10000000, color: [0, 100, 0, 0.7] },      // 10000001-15000000
            { value: 15000000, color: [0, 80, 0, 0.7] },       // 15000001-20000000
            { value: 20000000, color: [0, 50, 0, 0.7] }        // 20000000+ (dark green)
          ]
        }
      ]
    },
    outFields: ["*"],
    popupTemplate: new PopupTemplate({
      title: "US States",
      content: "{Name} Has a Total Population of {P0010001}"
    })
  });

  map.add(featureLayer);

  // Add the layer for US cities
  const featureLayer2 = new FeatureLayer({
    url: "https://services2.arcgis.com/bB9Y1bGKerz1PTl5/arcgis/rest/services/USA_Major_Cities/FeatureServer/0",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        style: "circle",
        color: [100, 80, 30, 1], // Green color
        size: 2,
        outline: {
          color: [255, 255, 255, 0.8], // White outline color
          width: 1
        }
      }
    },
    outFields: ["*"],
    popupTemplate: new PopupTemplate({
      title: "US Major City",
      content: "{NAME} has a Population of {POPULATION}"
    })
  });

  map.add(featureLayer2);

  // Add a BasemapToggle widget
  var basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "hybrid"
  });

  view.ui.add(basemapToggle, "bottom-left");

  // Add a Search widget
  var searchWidget = new Search({
    view: view
  });

  view.ui.add(searchWidget, {
    position: "top-right"
  });

  // Add a Home button
  var homeButton = new Home({
    view: view
  });

  view.ui.add(homeButton, "top-left");

  // Add a Legend widget
  var legend = new Legend({
    view: view,
    layerInfos: [
      {
        layer: featureLayer,
        title: "US States Population"
      },
      {
        layer: featureLayer2,
        title: "US Cities Population"
      }
    ]
  });

  view.ui.add(legend, "bottom-right");
});