define([
    "esri/WebScene",
    "esri/views/SceneView",
    "esri/widgets/DirectLineMeasurement3D"
  ],
  function (
    WebScene,
    SceneView,
    DirectLineMeasurement3D,
  ) {
    let webscene, view, measurementWidget;

    const websceneId = "47e435b2d97b464e8e994aea39517537";

    return {
      title: "Berlin Utilities",

      setup: function () {

        webscene = new WebScene({
          portalItem: {
            id: websceneId
          }
        });

        view = new SceneView({
          map: webscene,
          container: "viewDiv",
          padding: {
            top: 70,
            right: 500
          },
          ui: {
            padding: {
              right: 150
            }
          },
          qualityProfile: "high",
          environment: {
            lighting: {
              directShadowsEnabled: true,
              ambientOcclusionEnabled: true
            },
            atmosphereEnabled: true,
            starsEnabled: false
          }
        });

        window.view = view;

        // add a transparency slider
        view.ui.empty("top-left");
        view.ui.add("slider-container", "top-left");
      },

      steps: [

        /////////////////////////////////////////////////////////////////////////////////
        //
        //  Step 1: Adjust ground transparency with a slider
        //
        /////////////////////////////////////////////////////////////////////////////////

        {

          title: "Explore data under ground",

          code:
           `
  // allow underground navigation
  webscene.ground.navigationConstraint = {
    type: "none"
  };

  // update ground opacity
  on("slider-change", function (value){
    webscene.ground.opacity = value;
  });
`,
          before: function () {
            const slider = document.getElementById("opacity-slider");
            document.getElementById("opacity-slider").addEventListener("input", function(event) {
              const value = parseFloat(event.target.value);
              webscene.ground.opacity = value;
            });
          },

        },

        /////////////////////////////////////////////////////////////////////////////////
        //
        //  Step 2: Add line measurement tool
        //
        /////////////////////////////////////////////////////////////////////////////////

        {

          title: "Add line measurement tool",

          code: `
const widget = new DirectLineMeasurement3D({ view: view });
view.ui.add(widget, "top-left");
`,
          before: function () {
            view.map.presentation.slides.getItemAt(0).applyTo(view);
          },

          run: function () {
            measurementWidget = new DirectLineMeasurement3D({
              view: view
            });
            view.ui.add(measurementWidget, "top-left");

          }
        }

      ]
    }
  });
