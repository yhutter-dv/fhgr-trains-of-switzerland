import maplibregl from "maplibre-gl";
import { HeatmapLayer, ScatterplotLayer } from "deck.gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { DataFilterExtension } from "@deck.gl/extensions";
import "maplibre-gl/dist/maplibre-gl.css";

const FAST_API_URL = import.meta.env.VITE_API_URL;

let stations = [];
const filterRangeBegin = new Date("2025-03-02T00:00:00Z").getTime() / 1000;
const filterRangeEnd = new Date("2025-03-02T22:00:00Z").getTime() / 1000;
let filterRange = [filterRangeBegin, filterRangeEnd];


function getColorByPercentage(color1, color2, weight) {
    // https://stackoverflow.com/questions/30143082/how-to-get-color-value-from-gradient-by-percentage-with-javascript
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
    Math.round(color1[1] * w1 + color2[1] * w2),
    Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
}

async function loadStations() {
    const response = await fetch(`${FAST_API_URL}/stations`);
    const stations = await response.json();
    return stations;
}

async function loadArrivalDelaysForStations() {
    const response = await fetch(`${FAST_API_URL}/stations/arrival_delays`);
    const arrivalDelaysForStations = await response.json();
    return arrivalDelaysForStations;
}

function createHeatmapLayerForStations(stations) {
    // Implemented with reference to:
    // - https://github.com/visgl/deck.gl/blob/9.1-release/examples/website/heatmap/app.tsx
    // - https://maplibre.org/maplibre-gl-js/docs/examples/add-deckgl-layer-using-rest-api/
    const radiusPixels = 30;
    const intensity = 1.0;
    const threshold = 0.03;
    const heatmapLayer = new HeatmapLayer({
        data: stations,
        id: "stations-heatmap",
        pickable: false,
        getPosition: (d) => [d.longitude, d.latitude],
        // TODO yhu: Use actual delay of station
        getWeight: (d) => Math.random(),
        radiusPixels,
        intensity,
        threshold,
    });
    return heatmapLayer;
}

function createScatterPlotLayerForStations(stations) {
    const scatterPlotLayer = new ScatterplotLayer({
        data: stations,
        id: "stations-scatter",
        pickable: true,
        opacity: 0.7,
        stroked: true,
        filled: true,
        radiusMinPixels: 14,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 5,
        getPosition: (d) => [d.longitude, d.latitude],
        getFillColor: (d) => {
            //TODO: Choose color depending on number of delays 
            return [211, 134, 155];
        },

        getLineColor: (d) => {
            return [29, 32, 33];
        },
        onClick: (d) => {
            console.log(d);
        },
    });
    return scatterPlotLayer;
}

function createScatterPlotLayerForArrivalDelayStations(
    arrivalDelaysStations,
    filterRange,
) {
    // Implemented with reference to:
    // - https://github.com/visgl/deck.gl/blob/9.1-release/examples/website/data-filter/app.tsx
    const dataFilter = new DataFilterExtension({
        filterSize: 1,
        fp64: true, // Enable 64bit Precision because we use Epoch TimeStamp
    });
    const scatterPlotLayer = new ScatterplotLayer({
        data: arrivalDelaysStations,
        id: "stations-scatter",
        pickable: true,
        opacity: 1.0,
        stroked: true,
        filled: true,
        radiusMinPixels: 14,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 5,
        getPosition: (d) => [d.longitude, d.latitude],
        getFillColor: (d) => {
            const color1 = [255, 0, 0];
            const color2 = [0, 255, 0];
            const percentage = d["arrival_delay_count_normalized"];
            const color = getColorByPercentage(color1, color2, percentage);
            return color;
        },

        getLineColor: (d) => {
            return [29, 32, 33];
        },
        onClick: (d) => {
            console.log(d);
        },
        getFilterValue: (d) => d["arrival_time_seconds"],
        filterRange,
        extensions: [dataFilter]
    });
    return scatterPlotLayer;
}


window.addEventListener("load", (async () => {
    const map = new maplibregl.Map({
        container: "map",
        style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
        center: [7.4474, 46.9481],
        zoom: 12,
    });
    stations = await loadStations();
    const arrivalDelaysForStations = await loadArrivalDelaysForStations();

    const heatmapLayer = createHeatmapLayerForStations(stations);
    const scatterLayerStations =
        createScatterPlotLayerForStations(stations);

    const startDate = new Date("2025-03-02T08:00:00Z")
    const endDate = new Date("2025-03-02T22:00:00Z")

    let filterRangeBegin = startDate.getTime() / 1000;
    const filterRangeEnd = endDate.getTime() / 1000;
    let filterRange = [filterRangeBegin, filterRangeEnd];
    const scatterLayerArrivalDelaysStations =
        createScatterPlotLayerForArrivalDelayStations(
            arrivalDelaysForStations,
            filterRange,
        );
    let overlay = new MapboxOverlay({
        layers: [scatterLayerArrivalDelaysStations],
    });
    map.addControl(overlay);

    const advanceTimeButton = document.getElementById(
        "advance-time-button"
    );

    advanceTimeButton.addEventListener("click", () => {
        startDate.setHours(startDate.getHours() + 1)
        filterRangeBegin =
            startDate.getTime() / 1000;
        filterRange[0] = filterRangeBegin;
        console.log(filterRange)
        const scatterLayerArrivalDelaysStations =
            createScatterPlotLayerForArrivalDelayStations(
                arrivalDelaysForStations,
                filterRange,
            );
        overlay.setProps({
            layers: [scatterLayerArrivalDelaysStations],
        });
    });
}));
