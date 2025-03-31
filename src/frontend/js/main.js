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

const mapBaseStyle = "https://vectortiles.geo.admin.ch/styles/ch.swisstopo.leichte-basiskarte.vt/style.json";
const markerStrokeColor = [46, 52, 64];
const markerOkColor = [163, 190, 140];
const markerErrorColor = [191, 97, 106];

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
            return markerOkColor;
        },

        getLineColor: (d) => {
            return markerStrokeColor;
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
    const min = filterRange[0]
    const max = filterRange[1]
    const span = max - min
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
            const color1 = markerErrorColor;
            const color2 = markerOkColor;
            const percentage = d["arrival_delay_count_normalized"];
            const color = getColorByPercentage(color1, color2, percentage);
            return color;
        },

        getLineColor: (d) => {
            return markerStrokeColor;
        },
        onClick: (d) => {
            console.log(d);
        },
        getFilterValue: (d) => d["arrival_time_seconds"],
        filterSoftRange: [min + span * 0.8, min + span],
        filterRange: [min, max],
        extensions: [dataFilter]
    });
    return scatterPlotLayer;
}

function createHeatmapLayerForArrivalDelayStations(arrivalDelaysStation, filterRange) {
    const dataFilter = new DataFilterExtension({
        filterSize: 1,
        fp64: true, // Enable 64bit Precision because we use Epoch TimeStamp
    });
    const radiusPixels = 30;
    const intensity = 1.0;
    const threshold = 0.03;
    const heatmapLayer = new HeatmapLayer({
        data: arrivalDelaysStation,
        id: "stations-heatmap",
        pickable: false,
        getPosition: (d) => [d.longitude, d.latitude],
        getWeight: (d) => d["arrival_delay_count_normalized"],
        radiusPixels,
        intensity,
        threshold,
        getFilterValue: (d) => d["arrival_time_seconds"],
        filterRange,
        // TODO: Figure out why the data filter extension does not work on a heatmap.
        extensions: [dataFilter]
    });
    return heatmapLayer;
}


window.addEventListener("load", (async () => {
    const map = new maplibregl.Map({
        container: "map",
        style: mapBaseStyle,
        center: [7.4474, 46.9481],
        zoom: 12,
    });
    stations = await loadStations();
    const arrivalDelaysForStations = await loadArrivalDelaysForStations();

    let startDate = new Date("2025-03-02T00:00:00Z")
    const endDate = new Date("2025-03-02T23:00:00Z")

    let filterRangeBegin = startDate.getTime() / 1000;
    const filterRangeEnd = endDate.getTime() / 1000;
    let filterRange = [filterRangeBegin, filterRangeEnd];

    //const layer = createHeatmapLayerForStations(stations);
    //const layer = createScatterPlotLayerForStations(stations);
    const layer = createScatterPlotLayerForArrivalDelayStations(arrivalDelaysForStations, filterRange);
    //const layer = createHeatmapLayerForArrivalDelayStations(arrivalDelaysForStations, filterRange)

    let overlay = new MapboxOverlay({
        layers: [layer],
    });
    map.addControl(overlay);

    const mapRangeSlider = document.getElementById("station-map-range-slider");
    mapRangeSlider.min = filterRangeBegin;
    mapRangeSlider.max = filterRangeEnd;
    mapRangeSlider.step = 60 // seconds

    const mapRangeSliderTooltip = document.getElementById("station-map-range-slider-tooltip")
    mapRangeSliderTooltip.innerHTML = `${startDate.toLocaleString()}`

    mapRangeSlider.addEventListener("input", () => {
        const epochSeconds = mapRangeSlider.value
        startDate = new Date(0)
        startDate.setUTCSeconds(epochSeconds)

        // Update Filter Range
        filterRangeBegin = startDate.getTime() / 1000;
        filterRange[0] = filterRangeBegin;

        // Update Range Slider Tooltip
        mapRangeSliderTooltip.innerHTML = `${startDate.toLocaleString()}`
        //const layer = createHeatmapLayerForArrivalDelayStations(arrivalDelaysForStations, filterRange);
        const layer = createScatterPlotLayerForArrivalDelayStations(arrivalDelaysForStations, filterRange);
        overlay.setProps({ layers: [layer] });
    });
}));
