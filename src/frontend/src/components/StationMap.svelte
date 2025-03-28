<script>
    import { onMount } from "svelte";
    import maplibregl from "maplibre-gl";
    import { HeatmapLayer, ScatterplotLayer } from "deck.gl";
    import { MapboxOverlay } from "@deck.gl/mapbox";
    import "maplibre-gl/dist/maplibre-gl.css";

    const FAST_API_URL = import.meta.env.VITE_API_URL;

    let stations = [];

    async function loadStations() {
        const response = await fetch(`${FAST_API_URL}/stations`);
        const stations = await response.json();
        return stations;
    }

    function addHeatmapLayerForStations(map, stations) {
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
        const overlay = new MapboxOverlay({
            layers: [heatmapLayer],
        });
        map.addControl(overlay);
    }

    function addScatterPlotLayerForStations(map, stations) {
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
                //TODO: Choose color depending on canton
                return [0, 153, 102];
            },

            getLineColor: (d) => {
                return [15, 23, 43];
            },
            onClick: (d) => {
                console.log(d);
            },
        });
        const overlay = new MapboxOverlay({
            layers: [scatterPlotLayer],
        });
        map.addControl(overlay);
    }

    onMount(async () => {
        const map = new maplibregl.Map({
            container: "map",
            style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
            center: [7.4474, 46.9481],
            zoom: 12,
        });
        stations = await loadStations();
        // addHeatmapLayerForStations(map, stations);
        addScatterPlotLayerForStations(map, stations);
    });
</script>

<div class="flex gap-2 place-content-between">
    <div>
        <p class="text-lg text-bold text-neutral-100">Delays per Station</p>
        <p class="text-md italic text-neutral-400">On Average</p>
    </div>
    <div class="self-start">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="size-5 stroke-2 stroke-neutral-300"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
        </svg>
    </div>
</div>
<div id="map" class="h-[80%] w-[100%] my-4 rounded-lg"></div>

<style>
</style>
